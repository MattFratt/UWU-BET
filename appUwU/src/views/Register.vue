<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import app from '../firebase/firebaseConfig.js';
  
  export default {
    name: 'Register',
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      register() {
        createUserWithEmailAndPassword(app.auth(), this.email, this.password)
          .then((userCredential) => {
            // Registrazione riuscita, puoi eseguire altre azioni qui se necessario
            console.log('Registration successful', userCredential.user);
            // Reindirizza l'utente alla Home Page o a un'altra pagina dopo la registrazione
            this.$router.push({ name: 'Home' });
          })
          .catch((error) => {
            // Gestisci gli errori di registrazione qui
            console.error('Registration error:', error.message);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Stili specifici per il componente di registrazione */
  /* Puoi aggiungere stili specifici qui se necessario */
  </style>
  