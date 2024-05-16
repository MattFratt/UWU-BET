<template>
  <div class="notification is-warning is-light" id="notifica">
    <button class="delete" @click="togliAlert"></button>
    <b>ATTENZIONE!</b> <br>
    Password o email errata
  </div>
  <div class="section">
    <div class="container" id="daBlurare" @keydown.enter="login">

      <h2 class="title">Login</h2>
      <div class="field">
        <p class="control has-icons-left has-icons-right">
          <input class="input" type="email" v-model="email" placeholder="Email">
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control has-icons-left">
          <input class="input" type="password" v-model="password" placeholder="Password">
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button class="button is-success" :class="{ 'is-loading': isLoading }" @click="login">Login</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth, db } from '../firebase/firebaseConfig.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import router from '../router/index.js'; 

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      try {
        // Effettua il login con l'email e la password
        await signInWithEmailAndPassword(auth, this.email, this.password);

        // Accreditare 5 soldi all'utente dopo il login
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const updatedMoney = userData.money + 5; // Aggiungi 5 soldi
          await updateDoc(userDoc, { money: updatedMoney });
        }

        // Reindirizzamento alla pagina Home
        router.push('/');

        // Opzionale: mostrare un messaggio di successo all'utente
        console.log('Login riuscito! Benvenuto a casa.');
      } catch (error) {
        document.getElementById('daBlurare').style.filter = 'blur(5px)'
        document.getElementById('notifica').style.display = 'block';
        document.getElementById('notifica').style.visibility = 'visible';
        document.getElementById('daBlurare').style.pointerEvents = 'none';
        console.error('Errore durante il login:', error);
        // Gestione degli errori durante il login
      }
      this.isLoading = false;
    },
    togliAlert() {
      document.getElementById('notifica').style.visibility = 'hidden';
      document.getElementById('notifica').style.display = 'block';

      document.getElementById('daBlurare').style.filter = 'none';
      document.getElementById('daBlurare').style.pointerEvents = 'all';

    }
  }
};

</script>
