<template>
    <form @submit.prevent="login">
      <input v-model="formData.email" type="email" placeholder="Email" required>
      <input v-model="formData.password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          email: '',
          password: ''
        }
      };
    },
    methods: {
      login() {
        
      }
    }
  };
  </script>
  
  <style scoped>
    /* Stili specifici del form di login */
    
  </style>
  