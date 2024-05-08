<template>
  <div>
    <h2>Aggiungi / Modifica scommessa</h2>
    <form @submit.prevent="betId ? updateBet() : addBet()">
      <label for="title">Evento:</label>
      <input type="text" id="title" v-model="title" required>
      <label for="quota">Quota:</label>
      <input type="number" id="quota" v-model="quota" required placeholder="UwU">
      <button type="submit" id="invia" >{{ betId ? 'Aggiorna' : 'Invia' }}</button>
      <button type="button" id="annulla" v-if="betId" @click="cancelEdit">Annulla</button> <!-- Add a Cancel button -->
      <button type="button" id="elimina" v-if="betId" @click="deleteBet">Elimina</button> <!-- Add a Delete button -->
    </form>
    <div v-if="bets.length > 0">
      <h3>Scommesse recenti</h3>
      <ul>
        <li v-for="bet in bets" :key="bet.id">
          {{ bet.title }} Q: {{bet.quota}}
          <button class="edit"@click="editBet(bet)">Modifica</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/firebaseConfig.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'AddBet',
  data() {
    return {
      title: '',
      quota: 1,
      bets: [],
      betId: null
    };
  },
  methods: {
    async addBet() {
      try {
        const betData = {
          title: this.title,
          quota: this.quota
        };
        await addDoc(collection(db, 'scommesse'), betData);
        this.title = '';
        this.quota = 1;
        await this.loadBets(); // Load the bets after adding a new one
      } catch (error) {
        console.error('Error adding bet:', error);
      }
    },
    async updateBet() {
      const betRef = doc(db, 'scommesse', this.betId);
      const betData = {
        title: this.title,
        quota: this.quota
      };
      await updateDoc(betRef, betData);
      this.title = '';
      this.quota = 1;
      this.betId = null;
      await this.loadBets(); // Reload the bets after updating one
    },
    cancelEdit() {
      this.title = '';
      this.quota = 1;
      this.betId = null;
    },
    async deleteBet() {
      const betRef = doc(db, 'scommesse', this.betId);
      await deleteDoc(betRef);
      this.title = '';
      this.quota = 1;
      this.betId = null;
      await this.loadBets(); // Reload the bets after deleting one
    },
    editBet(bet) {
      this.title = bet.title;
      this.quota = bet.quota;
      this.betId = bet.id; // Set the ID of the bet to be edited
    },
    async loadBets() {
      try {
        const querySnapshot = await getDocs(collection(db, 'scommesse'));
        this.bets = []; // Clear the bets array before loading new bets
        querySnapshot.forEach((doc) => {
          this.bets.push({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('Error loading bets:', error);
      }
    }
  },
  async mounted() {
    await this.loadBets(); // Use the loadBets method here
  }
};
</script>
  
<style scoped>
.topnav {
  background-color: black;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

input, button {
  padding: 0.5rem;
}

button {
  cursor: pointer;
}
.edit:hover{
  background-color: gray;
  color: white;
  border-radius: 5px;
}

#annulla{
  border: 4px solid blue;
  background-color: lightblue;
}
#annulla:hover{
  background-color: blue;
  color: white;
  border-radius: 5px;
}

#elimina{
  border: 4px solid red;
  background-color: lightcoral;
}
#elimina:hover{
  background-color: red;
  color: white;
  border-radius: 5px;
}
#invia{
  border: 4px solid green;
  background-color: lightgreen;
}
#invia:hover{
  background-color: green;
  color: white;
  border-radius: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}
  </style>
  