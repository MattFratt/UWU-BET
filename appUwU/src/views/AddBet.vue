<template>
    <div>
      <div class="topnav">
        <router-link to="/">Home</router-link>
        <router-link to="/add-bet">Aggiungi scommessa</router-link>
      </div>
      <h2>Add Bet</h2>
      <form @submit.prevent="addBet">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="title" required>
        <input type="number" id="quota" v-model="quota" required>
        <!-- Aggiungi altri campi per le informazioni della scommessa se necessario -->
  
        <button type="submit">Add Bet</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { db } from '../firebase/firebaseConfig.js';
  import { collection, addDoc } from 'firebase/firestore';
  
  export default {
    name: 'AddBet',
    data() {
      return {
        title: '',
        quota:  0
    };
    },
    methods: {
      async addBet() {
        try {
          const betData = {
            title: this.title,
            quota: this.quota
            // Aggiungi altri campi della scommessa se necessario
          };
          
          // Aggiungi la scommessa al database Firestore
          const docRef = await addDoc(collection(db, 'scommesse'), betData);

          console.log('Bet added with ID:', docRef.id);
  
          // Resetta i campi del form dopo l'inserimento della scommessa
          this.title = '';
          // Resetta altri campi del form se presenti
  
          // Puoi anche reindirizzare l'utente ad un'altra pagina dopo l'inserimento della scommessa
          // this.$router.push({ name: 'Home' });
        } catch (error) {
          console.error('Error adding bet:', error);
          // Gestisci eventuali errori durante l'inserimento della scommessa
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .topnav{
    background-color: black;
    
  }
  </style>
  