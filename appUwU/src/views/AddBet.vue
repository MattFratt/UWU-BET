<template>
  <div class="container">
    <h2 class="title">Aggiungi / Modifica scommessa</h2>
    <div class="field">
      <label class="label" for="title">Evento:</label>
      <div class="control">
        <input class="input" type="text" id="title" v-model="title" required>
      </div>
    </div>
    <div class="field">
      <label class="label" for="quota">Quota:</label>
      <div class="control">
        <input class="input" type="number" id="quota" v-model="quota" required placeholder="UwU">
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" type="submit" id="invia">{{ betId ? 'Aggiorna' : 'Invia' }}</button>
      </div>
      <div class="control">
        <button class="button is-light" type="button" id="annulla" v-if="betId" @click="cancelEdit">Annulla</button>
      </div>
      <div class="control">
        <button class="button is-danger" type="button" id="elimina" v-if="betId" @click="deleteBet">Elimina</button>
      </div>
    </div>
    <div v-if="bets.length > 0" class="box">
      <h3 class="title">Scommesse recenti</h3>
      <ul>
        <li v-for="bet in bets" :key="bet.id">
          {{ bet.title }} Q: {{ bet.quota }} scommettitori {{ bet.users }}
          <button class="button is-small is-info" @click="editBet(bet)">Modifica</button>
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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

h1,
h2,
h3 {
  color: #333;
}

.box,
.input {
  background-color: #c9c9c9c9;
  color: #000000
}

.label {
  color: #000000
}
</style>