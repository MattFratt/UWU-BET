<template>

  <div class="container">
    <p class="title">Benvenuti nel miglior sito di scommesse doliche</p>
    <p class="subtitle">Accedi o registrati per iniziare a scommettere!</p>
    <router-link v-if="!isLoggedIn" class="button is-primary" to="/login">Login</router-link>
    <router-link v-if="!isLoggedIn" class="button is-link" to="/register">Registrati</router-link>



     <button v-if="isLoggedIn" class="button is-danger" @click="logout">Logout </button>
     <h1 v-if="isLoggedIn" class="title" id="accountAccesso">Bentornato <div class="emailMain">{{ currentUserEmail }}</div> ! </h1>
    <!-- Visualizza la lista degli utenti -->
    <div>
      <h2 class="title">Lista Utenti</h2>
      <ul class="container">
        <li v-for="user in users" :key="user.id">
          {{ user.email }} - Saldo: <span class="tag is-success">{{ user.money }}</span>
        </li>
      </ul>
    </div>

    <!-- Visualizza il saldo dell'utente -->
    <p class="tag is-info">UwU disponibili: {{ money }}</p>

    <!-- Visualizza le scommesse recenti -->
    <div class="container" v-if="bets.length > 0" >
      <h3 class="title">Scommesse recenti</h3>
      <ul >
        <li v-for="bet in bets" :key="bet.id">
        <div class="scommessa"> {{ bet.title }} | Quota: {{ bet.quota }}</div>
        aggiungere timer scadenza scommessa
          <button class="button is-danger" @click="placeBet(bet)">Scommetti subito!</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nessuna scommessa disponibile al momento.</p>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { db } from '../firebase/firebaseConfig.js';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig.js';
import { loadUsers } from '../services/userService';
import { onAuthStateChanged } from 'firebase/auth';



export default {
  name: 'Home',
  data() {
    return {
      currentUserEmail: null,
      isLoggedIn: false,
      users: [],
      bets: [],
      money: 0
    };
  },
  async mounted() {
    // Carica gli utenti
    this.loadUsers();
    this.loadCurrentUserEmail();

    // Carica le scommesse dal database Firestore
    try {
      const querySnapshot = await getDocs(collection(db, 'scommesse'));
      querySnapshot.forEach((doc) => {
        this.bets.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('Errore nel caricare le scommesse:', error);
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserEmail = user.email;
        this.isLoggedIn = true;
      } else {
        this.currentUserEmail = null;
        this.isLoggedIn = false;
      }
    });
    // Carica il saldo dell'utente corrente
    this.loadUserMoney();
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.isLoggedIn = false;
      }).catch((error) => {
        console.error('Error logging out:', error);
      });
    },
    async loadUsers() {
      try {
        this.users = await loadUsers();
      } catch (error) {
        console.error('Errore durante il caricamento degli utenti:', error);
      }
    },
    async loadUserMoney() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.email)); // Utilizza l'email come ID
          if (userDoc.exists()) {
            this.money = userDoc.data().money;
          } else {
            console.error('Documento utente non trovato nel database');
          }
        } else {
          console.error('Utente non autenticato');
        }
      } catch (error) {
        console.error('Errore nel caricare il denaro dell\'utente:', error);
      }
    },

    async placeBet(bet) {
      const betAmount = parseInt(prompt('Quanto vuoi scommettere?', '0'));
      if (isNaN(betAmount) || betAmount <= 0) {
        alert('Per favore inserisci un importo valido!');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato');
        return;
      }

      // Verifica se l'utente ha abbastanza denaro per la scommessa
      const userDoc = await getDoc(doc(db, 'users', user.email));
      const currentMoney = userDoc.data().money;
      if (betAmount > currentMoney) {
        alert('Non hai abbastanza denaro per questa scommessa!');
        return;
      }

      // Sottrai il valore della scommessa dal saldo dell'utente nel database
      const newMoney = currentMoney - betAmount;
      try {
        await updateDoc(doc(db, 'users', user.email), { money: newMoney });
      } catch (error) {
        console.error('Errore nell\'aggiornare il denaro dell\'utente:', error);
        return;
      }

      // Aggiorna le informazioni della scommessa nel database Firestore
      try {
        const betRef = doc(db, 'scommesse', bet.id);
        const betDoc = await getDoc(betRef);
        const betData = betDoc.data();
        console.log(betData + " suca " + betData.users);

        // Aggiungi l'utente alla mappa degli utenti della scommessa
        const usersMap = betData.users || {};
        if (usersMap[user.email]) {
          usersMap[user.email] += betAmount; // Se l'utente ha già scommesso, aggiorna l'importo
        } else {
          usersMap[user.email] = betAmount; // Se l'utente non ha ancora scommesso, crea un nuovo record
        }

        // Aggiorna il numero totale di scommettitori
        const totalBetters = Object.keys(usersMap).length;

        // Aggiorna le informazioni della scommessa nel database
        await updateDoc(betRef, { users: usersMap, totalBetters });
        alert('Scommessa effettuata con successo!');
      } catch (error) {
        console.error('Errore nell\'aggiornare le informazioni della scommessa:', error);
      }
    }


    ,
    async loadCurrentUserEmail() {
      const user = auth.currentUser;
      if (user) {
        this.currentUserEmail = user.email;
      }
    },
    async placeBet(bet) {
      const betAmount = parseInt(prompt('Quanto vuoi scommettere?', '0'));
      if (isNaN(betAmount) || betAmount <= 0) {
        alert('Per favore inserisci un importo valido!');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato');
        return;
      }

      // Verifica se l'utente ha abbastanza denaro per la scommessa
      const userDoc = await getDoc(doc(db, 'users', user.email));
      const currentMoney = userDoc.data().money;
      if (betAmount > currentMoney) {
        alert('Non hai abbastanza denaro per questa scommessa!');
        return;
      }

      // Sottrai il valore della scommessa dal saldo dell'utente nel database
      const newMoney = currentMoney - betAmount;
      try {
        await updateDoc(doc(db, 'users', user.email), { money: newMoney });
      } catch (error) {
        console.error('Errore nell\'aggiornare il denaro dell\'utente:', error);
        return;
      }

      // Aggiorna le informazioni della scommessa nel database Firestore
      try {
        const betRef = doc(db, 'scommesse', bet.id);
        const betDoc = await getDoc(betRef);
        const betData = betDoc.data();
        const users = betData.users || {};

        // If the user has already placed a bet, add the new bet amount to the existing one
        // Otherwise, add the user to the users object with the bet amount
        if (users[user.email]) {
          users[user.email] += betAmount;
        } else {
          users[user.email] = betAmount;
        }

        await updateDoc(betRef, { users });
        alert('Scommessa effettuata con successo!');
      } catch (error) {
        console.error('Errore nell\'aggiornare le informazioni della scommessa:', error);
      }
    }
  }
};
</script>

<style scoped>



p {
  margin-bottom: 10px;

}

a {

  text-decoration: none;
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
}

a:hover {
  text-decoration: none;
  background-color: #0056b3;
}

h1,
h2,
h3 {

}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  color: #000000;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
}

.balance {
  font-weight: bold;
  color: #007bff;
}

.recent-bets {
  margin-top: 20px;
}

.recent-bets h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.bet-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;

  border: none;
  border-radius: 5px;
}

.bet-button:hover {
  background-color: #0056b3;
}

.box {
  background-color: #c9c9c9;
  padding: 20px;
  border-radius: 10px;
}
.emailMain{
  display: inline-block;
  color: rgb(171, 253, 76);
}
#accountAccesso{
  font-size: medium;
}

</style>
