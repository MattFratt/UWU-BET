<template>
  <div>
    <p>Benvenuti nel miglior sito di scommesse doliche</p>
    <p>Denaro disponibile: {{ money }}</p> <!-- Display the user's virtual money -->
    <!-- Display the bets -->
    <div v-if="bets.length > 0">
      <h3>Scommesse recenti</h3>
      <ul>
        <li v-for="bet in bets" :key="bet.id">
          {{ bet.title }} Q: {{bet.quota}}
          <button @click="placeBet(bet)">Scommetti</button> <!-- Add a Bet button to each bet -->
        </li>
      </ul>
    </div>
    <!-- Display a message if there are no bets -->
    <div v-else>
      <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fgifer.com%2Fen%2F1UUe&psig=AOvVaw2crwEuo81lx0I4Uxpm7bU5&ust=1715255004322000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNDa6vv8_YUDFQAAAAAdAAAAABAK">
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/firebaseConfig.js';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default {
  name: 'Home',
  data() {
    return {
      bets: [],
      money: 5, // The user's virtual money
    };
  },
  methods: {
    async placeBet(bet) {
      const betAmount = parseInt(prompt('Quanto vuoi scommettere?', '0')); // Ask the user how much they want to bet
      if (isNaN(betAmount) || betAmount <= 0) {
        alert('Per favore inserisci un importo valido!');
        return;
      }
      if (betAmount > this.money) {
        alert('Non hai abbastanza denaro per questa scommessa!');
        return;
      }
      this.money -= betAmount; // Subtract the bet amount from the user's money
      // Update the user's money in the database
      const userRef = doc(db, 'users', 'yourUserId');
      await updateDoc(userRef, { money: this.money });
      // Add the bet to the user's bets in the database
      const betRef = doc(db, 'scommesse', bet.id);
      await updateDoc(betRef, { users: { 'yourUserId': betAmount } });
    }
  },
  async mounted() {
    // Load the bets from the Firestore database
    try {
      const querySnapshot = await getDocs(collection(db, 'scommesse'));
      querySnapshot.forEach((doc) => {
        // Add the bet to the 'bets' array
        this.bets.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('Errore nel caricare le bet:', error);
      // Handle any errors while loading the bets
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

div {
  margin: 0 auto;
  width: 80%;
  padding: 20px;
}

p {
  color: #333;
}

h3 {
  color: #444;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #008CBA; /* Blue */
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

#quota {
  background-color: green;
}
</style>