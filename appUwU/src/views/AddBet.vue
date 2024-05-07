<template>
    <div>
      <h2>Add Bet</h2>
      <form @submit.prevent="addBet">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="title" required>
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
        title: ''
        // Aggiungi altri dati della scommessa se necessario
      };
    },
    methods: {
      async addBet() {
        try {
          const betData = {
            title: this.title
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
  /* Stili specifici per il componente AddBet */
  /* Puoi aggiungere stili specifici qui se necessario */
  </style>
  