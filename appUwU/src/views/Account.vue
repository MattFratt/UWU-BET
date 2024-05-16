<template>
    <section class="section">
        <div class="container" @keydown.enter="login">
            <header>
                <h1 class="title" id="email">{{ this.email }}</h1>
            </header>
            <main class="boxerellino">
                <article class="container">
                    <h2 class="title">Giocate recenti</h2>
                    <ul>
                        <li v-for="(game, index) in recentGames" :key="index">{{ game }}</li>
                    </ul>
                    <h3 class="title">Vincita massima</h3>
                    <p>{{ maxWin }}</p>
                </article>
                <article class="container">
                    <h2 class="title">Saldo attuale</h2>
                    <p>{{ currentBalance }}</p>
                    <h3 class="title">Massimo storico</h3>
                    <p>{{ highestBalance }}</p>

                </article>
            </main>
        </div>
    </section>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';
import { auth } from '../firebase/firebaseConfig.js';  // Import your Firebase auth instance

export default {
    name: 'Account',
    data() {
        return {
            recentGames: localStorage.getItem('recentGames') ? JSON.parse(localStorage.getItem('recentGames')) : [],
            maxWin: localStorage.getItem('maxWin') ? JSON.parse(localStorage.getItem('maxWin')) : '',
            currentBalance: localStorage.getItem('currentBalance') ? JSON.parse(localStorage.getItem('currentBalance')) : '',
            highestBalance: localStorage.getItem('highestBalance') ? JSON.parse(localStorage.getItem('highestBalance')) : '',
            email: auth.currentUser.email
        }
    },
    methods: {
        async fetchData() {
            const userRef = doc(db, 'users', this.email);  // Get the currently logged-in user's document
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();

            this.maxWin = userData.maxWin;
            this.currentBalance = userData.money;
            this.highestBalance = userData.highestBalance;

            // Save the data to local storage
            localStorage.setItem('maxWin', JSON.stringify(this.maxWin));
            localStorage.setItem('currentBalance', JSON.stringify(this.currentBalance));
            localStorage.setItem('highestBalance', JSON.stringify(this.highestBalance));

            // Fetch recent games as before
        }
    },
    created() {
        this.fetchData();
    }
}
</script>

<style scoped>
#email {
    color: lime;

}

.section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2em;
}

.container {
    max-width: 800px;
    width: 100%;
    padding: 2em;
    margin-bottom: 2em;
}

.boxerellino {
    display: flex;
    flex-direction: column;
    gap: 2em;
}

h1,
h2,
h3 {
    color: #c9c9c9c9;
}

h1 {
    font-size: 2em;
    margin-bottom: 1em;
}

h2 {
    font-size: 1.5em;
    margin-bottom: 0.5em;
}

h3 {
    font-size: 1.2em;
    margin-bottom: 0.3em;
}

p {
    color: #c9c9c9;
    line-height: 1.6;
}
</style>