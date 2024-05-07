<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        <button type="submit">Login</button>
        <p>{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase/firebaseConfig.js';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      login() {
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then(() => {
            // Login riuscito, puoi eseguire altre azioni qui se necessario
            console.log('Login successful');
            // Reindirizza l'utente alla Home Page o a un'altra pagina dopo il login
            this.$router.push({ name: 'Home' });
          })
          .catch((error) => {
            // Gestisci gli errori di login qui
            console.error('Login error:', error.message);
            this.errorMessage = error.message; // Mostra un messaggio di errore all'utente
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Stili specifici per il componente di login */
  /* Puoi aggiungere stili specifici qui se necessario */
  </style>
  