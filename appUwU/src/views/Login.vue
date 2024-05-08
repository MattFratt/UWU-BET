<template>
  <div>
    <h2>Login</h2>
    <input type="email" v-model="email" placeholder="Email">
    <input type="password" v-model="password" placeholder="Password">
    <button @click="login">Login</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth } from '../firebase/firebaseConfig.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import router from '../router/index.js'; // Assicurati di aver configurato correttamente il router

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        // Effettua il login con l'email e la password
        await signInWithEmailAndPassword(auth, this.email, this.password);
        
        // Reindirizzamento alla pagina Home
        router.push('/');
        
        // Accreditare 5 soldi all'utente dopo il login
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const updatedMoney = userData.money + 5; // Aggiungi 5 soldi
          await updateDoc(userDoc, { money: updatedMoney });
        }
        
        // Opzionale: mostrare un messaggio di successo all'utente
        console.log('Login riuscito! Benvenuto a casa.');
      } catch (error) {
        console.error('Errore durante il login:', error);
        // Gestione degli errori durante il login
      }
    }
  }
};

</script>
