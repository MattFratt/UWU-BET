<template>
  <div class="section">
    <div class="container">
      <h2 class="title">Registrazione</h2>
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
          <button class="button is-success" @click="register">Registrati</button>
        </p>
      </div>
      <h1 class="title is-4 has-text-danger"> {{ errorMessage }}</h1>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth } from '../firebase/firebaseConfig.js';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: " "
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Aggiungi l'utente al database con l'email come ID
        await setDoc(doc(db, 'users', user.email), {
          email: user.email,
          money: 5 // Assegna 5 monete all'utente appena registrato
        });

        // Reindirizza l'utente a una pagina di successo o alla home
        router.push('/');
      } catch (error) {
        console.error('Errore durante la registrazione:', error);
        // Gestione degli errori durante la registrazione
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = "Email già in uso";
          console.log('Email già in uso');
        }
      }
    },
    async assignCoins(userId) {
      try {
        const userDocRef = doc(db, 'users', userId); // Ottieni il riferimento al documento dell'utente nel database

        // Aggiorna il documento dell'utente nel database con il nuovo saldo
        await setDoc(userDocRef, { money: 5 }, { merge: true });

        console.log('Monete assegnate con successo all\'utente.');
      } catch (error) {
        console.error('Errore durante l\'assegnazione delle monete:', error);
        // Gestisci eventuali errori durante l'assegnazione delle monete
      }
    }
  }
};
</script>
