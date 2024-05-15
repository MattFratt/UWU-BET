<template>
  <div class="container">
    <h2 class="title">Aggiungi / Modifica scommessa</h2>
    <form @submit.prevent="betId ? updateBet() : addBet()">
      <div class="field">
        <label class="label" for="title">Evento:</label>
        <div class="control">
          <input class="input" type="text" id="title" v-model="title" required> <!--NOME-->
        </div>
      </div>
      <div class="field">
        <label class="label" for="quota">Quota:</label>
        <div class="control">
          <input class="input" type="number" id="quota" v-model="quota" required placeholder="UwU"> <!--QUOTA-->
        </div>
      </div>
     
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" :class="{ 'is-loading': isLoading }" type="submit" id="invia">{{ betId ?
            'Aggiorna' : 'Invia' }}</button>
        </div>
        <div class="control">
          <button class="button" type="button" id="annulla" v-if="betId" @click="cancelEdit">Annulla</button>
          <!-- Add a Cancel button -->
        </div>
        <div class="control">
          <button class="button is-danger" :class="{ 'is-loading': deleteLoading }" type="button" id="elimina"
            v-if="betId" @click="deleteBet">Elimina</button>
          <!-- Add a Delete button -->
        </div>
      </div>
    </form>
    <div v-if="bets.length > 0">
      <h3 class="title is-4">Scommesse recenti</h3>
      <ul>
        <li v-for="bet in bets" :key="bet.id" class="box">
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
      betId: null,
      isLoading: false,
      deleteLoading: false
    };
  },
  methods: {
    async addBet() {
      this.isLoading = true;
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
      this.isLoading = false;

    },
    async updateBet() {
      this.isLoading = true;
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
      this.isLoading = false;
    },
    cancelEdit() {
      this.title = '';
      this.quota = 1;
      this.betId = null;
    },
    async deleteBet() {
      this.deleteLoading = true;

      const betRef = doc(db, 'scommesse', this.betId);
      await deleteDoc(betRef);
      this.title = '';
      this.quota = 1;
      this.betId = null;
      await this.loadBets(); // Reload the bets after deleting one
      this.deleteLoading = false;
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
  color: #c9c9c9c9;
}

.box,
.input {
  background-color: #c9c9c9c9;
  color: #000000
}

.label {
  color: #c9c9c9c9
}
</style>