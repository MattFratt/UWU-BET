<template>
    <div>
      <h2>Home</h2>
      <p>Welcome to Our Betting Website</p>
  
      <!-- Visualizzazione delle scommesse -->
      <div v-if="bets.length > 0">
        <h3>Recent Bets</h3>
        <ul>
          <li v-for="bet in bets" :key="bet.id">{{ bet.title }}</li>
        </ul>
      </div>
  
      <!-- Link per aggiungere una nuova scommessa -->
      <router-link to="/add-bet">Add a Bet</router-link>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase/firebaseConfig.js';
  import { collection, getDocs } from 'firebase/firestore';
  
  export default {
    name: 'Home',
    data() {
      return {
        bets: []
      };
    },
    async mounted() {
      // Carica le scommesse dal database Firestore
      try {
        const querySnapshot = await getDocs(collection(db, 'scommesse'));
        querySnapshot.forEach((doc) => {
          // Aggiungi la scommessa all'array 'bets'
          this.bets.push({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('Error loading bets:', error);
        // Gestisci eventuali errori durante il caricamento delle scommesse
      }
    }
  };
  </script>
  
  <style scoped>
  /* Stili specifici per la Home Page */
  /* Puoi aggiungere stili specifici qui se necessario */
  </style>
  