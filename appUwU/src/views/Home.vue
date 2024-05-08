<template>
  <div>
    <p>Benvenuti nel miglior sito di scommesse doliche</p>
    <p>Accedi o registrati per iniziare a scommettere!</p>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Registrati</router-link>

    <h1>Ciao {{ currentUserEmail }} </h1>
    <!-- Visualizza la lista degli utenti -->
    <div>
      <h2>Lista Utenti</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.email }} - Saldo: {{ user.money }}
        </li>
      </ul>
    </div>

    <!-- Visualizza il saldo dell'utente -->
    <p>Denaro disponibile: {{ money }}</p>

    <!-- Visualizza le scommesse recenti -->
    <div v-if="bets.length > 0">
      <h3>Scommesse recenti</h3>
      <ul>
        <li v-for="bet in bets" :key="bet.id">
          {{ bet.title }} Quota: {{ bet.quota }}
          <button @click="placeBet(bet)">Scommetti</button>
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
import { collection, getDocs, doc, updateDoc,getDoc} from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig.js';
import { loadUsers } from '../services/userService';



export default {
  name: 'Home',
  data() {
    return {
      currentUserEmail: '',
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

    // Carica il saldo dell'utente corrente
    this.loadUserMoney();
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
    const betRef = doc(db, 'scommesse', bet.id); // Ottieni il riferimento al documento della scommessa
    const betDoc = await getDoc(betRef);
    const betData = betDoc.data();
    const users = betData.users || {};
    
    // Verifica se l'utente è già presente nella lista dei partecipanti
    if (users[user.email]) {
      users[user.email] += betAmount; // Aggiungi l'importo della scommessa al denaro già scommesso dall'utente
    } else {
      users[user.email] = betAmount; // Aggiungi l'utente alla lista dei partecipanti con l'importo della scommessa
    }
    
    await updateDoc(betRef, { users });
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
        await updateDoc(betRef, { users: { [user.email]: betAmount } });
        alert('Scommessa effettuata con successo!');
      } catch (error) {
        console.error('Errore nell\'aggiornare le informazioni della scommessa:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Stili specifici per Home.vue */

/* Stile per il contenitore principale */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/* Stile per i paragrafi */
p {
  margin-bottom: 10px;
}

/* Stile per i link */
a {
  color: #007bff;
  text-decoration: none;
  margin-right: 10px;
}

a:hover {
  text-decoration: underline;
}

/* Stile per l'header */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Stile per la lista degli utenti */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

/* Stile per il saldo dell'utente */
.balance {
  font-weight: bold;
}

/* Stile per le scommesse recenti */
.recent-bets {
  margin-top: 20px;
}

.recent-bets h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

/* Stile per i pulsanti */
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>
