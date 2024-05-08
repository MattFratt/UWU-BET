<template>
    <div>
      <div class="topnav">
        <router-link to="/">Home</router-link>
        <router-link to="/add-bet">Aggiungi scommessa</router-link>
      </div>
      <p>Benvenuti nel miglior sito di scommesse doliche</p>
  
      <!-- Visualizzazione delle scommesse -->
      <div v-if="bets.length > 0">
        <h3>Recent Bets</h3>
        <ul>
          <li v-for="bet in bets" :key="bet.id">{{ bet.title }} <div id="quota">{{bet.quota}} </div></li>
        </ul>
      </div>
  
      <!-- Link per aggiungere una nuova scommessa -->
      <router-link to="/add-bet">Aggiungi scommessa</router-link>
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
        console.error('Errore nel caricare le bet:', error);
        // Gestisci eventuali errori durante il caricamento delle scommesse
      }
    }
  };
  </script>
  
  <style scoped>
  #quota{
    background-color: green;
  }
  </style>
  