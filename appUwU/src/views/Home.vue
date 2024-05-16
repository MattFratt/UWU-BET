<template>

  <div class="container">
    <p class="title">Benvenuto nel miglior sito di scommesse doliche</p> <br>
    <p class="subtitle" v-if="!isLoggedIn">Accedi o registrati per iniziare a scommettere!</p>

    <h1 v-if="isLoggedIn" class="title" id="accountAccesso">Bentornato <div class="emailMain">{{ currentUserEmail }}
      </div> ! </h1>
    <!-- Visualizza la lista degli utenti 
    <div class="dropdown" :class="{ 'is-active': showUsers }">
      <div class="dropdown-trigger">
        <button class="button" @click="showUsers = !showUsers">
          <span>Utenti</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a v-for="user in users" :key="user.id" class="dropdown-item">
            {{ user.email }} - Saldo: <span class="tag is-success">{{ user.money }}</span>
          </a>
        </div>
      </div>
    </div>
                    -->
    <!-- Visualizza il saldo dell'utente -->
    <p class="tag is-info">UwU disponibili: {{ money }}</p>

    <!-- Visualizza le scommesse recenti -->
    <div class="container" v-if="bets.length > 0">
      <h3 class="title">Scommesse recenti</h3>
      <ul>
        <li v-for="bet in bets" :key="bet.id">
          <div class="scommessa"> {{ bet.title }} | Quota: {{ bet.quota }}</div>
          <div>Scadenza: {{ getRemainingTime(bet.expiryDate) }}</div>
          <button class="button is-danger" @click="placeBet(bet)" v-bind:disabled="isExpired(bet)">Scommetti
            subito!</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nessuna scommessa disponibile al momento.</p>
    </div>
  </div>

</template>

<script>
import { ref, reactive, toRefs } from 'vue';
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
      showUsers: false,
      isLoggedIn: false,
      users: [],
      bets: reactive([]),
      money: 0,
      timers: []
    };
  },
  async mounted() {
    this.loadUsers();
    this.loadCurrentUserEmail();

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

    this.loadUserMoney();

    this.$nextTick(() => {
      this.startTimers();
    });

    setInterval(() => {
      this.updateTimers();
    }, 1000); // Ogni secondo


  },
  methods: {
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
          const userDoc = await getDoc(doc(db, 'users', user.email));
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
    async loadCurrentUserEmail() {
      const user = auth.currentUser;
      if (user) {
        this.currentUserEmail = user.email;
      }
    },
    async placeBet(bet) {
      if (!auth.currentUser) {
        alert('Per favore effettua il login per scommettere!');
        console.error('Utente non autenticato');
        return;
      }

      if (this.isExpired(bet)) {
        alert('La scommessa è scaduta!');
        return;
      }

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

      const userDoc = await getDoc(doc(db, 'users', user.email));
      const currentMoney = userDoc.data().money;
      if (betAmount > currentMoney) {
        alert('Non hai abbastanza denaro per questa scommessa!');
        return;
      }

      const newMoney = currentMoney - betAmount;
      try {
        await updateDoc(doc(db, 'users', user.email), { money: newMoney });
      } catch (error) {
        console.error('Errore nell\'aggiornare il denaro dell\'utente:', error);
        return;
      }

      try {
        const betRef = doc(db, 'scommesse', bet.id);
        const betDoc = await getDoc(betRef);
        const betData = betDoc.data();
        const users = betData.users || {};

        if (users[user.email]) {
          users[user.email] += betAmount;
        } else {
          users[user.email] = betAmount;
        }

        await updateDoc(betRef, { users });
        this.loadUserMoney();
        alert('Scommessa effettuata con successo!');
      } catch (error) {
        console.error('Errore nell\'aggiornare le informazioni della scommessa:', error);
      }
    },
    startTimers() {
      this.bets.forEach((bet, index) => {
        const timer = setInterval(() => {
          this.updateTimer(bet, index);
        }, 1000); // Every second
        this.timers.push(timer);
      });
    },
    updateTimers() {
      this.bets.forEach((bet, index) => {
        this.updateTimer(bet, index);
      });
    },
    updateTimer(bet, index) {
      try {
        const remainingTime = this.getRemainingTime(bet.expiryDate);
        // Creazione di un nuovo oggetto scommessa con il tempo rimanente aggiornato
        const updatedBet = { ...bet, remainingTime };
        // Assegnazione del nuovo oggetto scommessa direttamente all'array
        this.bets[index] = updatedBet;
      } catch (error) {
        console.error('Errore durante l\'aggiornamento del timer:', error);
      }
    },
    getRemainingTime(expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diffInMilliseconds = expiry - now;
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    },

    isExpired(bet) {
      const now = new Date();
      const expiry = new Date(bet.expiryDate);
      return now >= expiry;
    },
    beforeUnmount() {
      // Pulisce i timer prima che il componente venga smontato per evitare perdite di memoria
      this.timers.forEach(timer => clearInterval(timer));
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
h3 {}

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

.emailMain {
  display: inline-block;
  color: rgb(171, 253, 76);
}

#accountAccesso {
  font-size: medium;
}
</style>
