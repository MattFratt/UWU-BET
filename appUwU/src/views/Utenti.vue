<template>
    <div class="container">
        <div class="box" v-for="user in users" :key="user.id">
            <h2 class="title is-4">{{ user.email }}</h2>
            <ul>
                <li v-for="bet in user.bets" :key="bet.id">
                    <p class="subtitle is-6">{{ bet.title }} - {{ bet.amount }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '../firebase/firebaseConfig.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
    data() {
        return {
            users: [],
        };
    },
    async created() {
        try {
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), bets: [] }));

            console.log('Fetched users:', users);

            const betsCollection = collection(db, 'scommesse');
            const betsSnapshot = await getDocs(betsCollection);
            const bets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log('Fetched bets:', bets);

            for (const user of users) {
                for (const bet of bets) {
                    if (bet.users && bet.users[user.email]) { // Add this line
                        user.bets.push({ title: bet.title, amount: bet.users[user.email] });
                    }
                }
            }

            console.log('Processed users:', users);

            this.users = users;
        } catch (error) {
            console.error(error);
        }
    },
};
</script>