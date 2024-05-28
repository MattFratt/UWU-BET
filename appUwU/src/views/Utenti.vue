<template>
    <div class="columns">
        <div class="column is-1">


        </div>
        <div class="column is-10">
            <div class="container">
                <h2 class="title">Utenti</h2>
                <div class="paginona">
                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>UwU</th>
                                <th>Scommesse in corso</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{ user.email }}</td>
                                <td id="money">{{ user.money }}</td>
                                <td>
                                    <ul>
                                        <li v-for="bet in user.bets" :key="bet.id">
                                            <p class="subtitle is-6" v-if="!bet.closed"
                                                @click="removeUserFromBet(user.email, bet.id)">{{ bet.title }}
                                                - {{ bet.amount }}</p>
                                        </li>
                                    </ul>
                                </td> <!-- Utilizziamo una funzione per formattare le scommesse -->
                                <td>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '../firebase/firebaseConfig.js';
import { collection, onSnapshot, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            users: [],
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        async removeUserFromBet(userEmail, betId) {
            const { isConfirmed } = await Swal.fire({
                title: `${userEmail} ha vinto o perso?`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: `Vittoria`,
                denyButtonText: `Sconfitta`,
                confirmButtonColor: '#00ff22',
            });

            if (!isConfirmed) {
                const betRef = doc(db, 'scommesse', betId);
                const betSnapshot = await getDoc(betRef);
                const betData = betSnapshot.data();
                console.log("eliminare utente da bet");
                const userRef = doc(db, 'users', userEmail);
                const userSnapshot = await getDoc(userRef);
                const userData = userSnapshot.data();

                delete betData.users[userEmail];

                await updateDoc(betRef, { users: betData.users });

                console.log(`Removed ${userEmail} from bet ${betId}`);
                this.fetchData();

                // Close bet
                this.closeBet(betId);
            }

            try {
                const betRef = doc(db, 'scommesse', betId);
                const betSnapshot = await getDoc(betRef);
                const betData = betSnapshot.data();

                if (betData.users && betData.users[userEmail]) {
                    const userRef = doc(db, 'users', userEmail);
                    const userSnapshot = await getDoc(userRef);
                    const userData = userSnapshot.data();

                    const prize = betData.users[userEmail] * betData.quota;
                    await Swal.fire(`La vincita per ${userEmail} è di ${prize} Uwu!`);
                    // Add the prize to the user's current money
                    const newMoney = userData.money + prize;

                    // Update the user's money in the database
                    await updateDoc(userRef, { money: newMoney });

                    // Update the user's max win and highest balance if necessary
                    if (!userData.maxWin || prize > userData.maxWin) {
                        await updateDoc(userRef, { maxWin: prize });
                    }
                    if (!userData.highestBalance || newMoney > userData.highestBalance) {
                        await updateDoc(userRef, { highestBalance: newMoney });
                    }

                    console.log(`Added ${prize} to ${userEmail}'s money.`);

                    delete betData.users[userEmail];

                    await updateDoc(betRef, { users: betData.users });

                    console.log(`Removed ${userEmail} from bet ${betId}`);
                    this.fetchData();

                    // Close bet
                    this.closeBet(betId);
                } else {
                    console.log(`${userEmail} is not in bet ${betId}`);
                }
            } catch (error) {
                console.error(error);
            }
        },

        async closeBet(betId) {
            const betRef = doc(db, 'scommesse', betId);
            await updateDoc(betRef, { closed: true });

            console.log(`Closed bet ${betId}`);
        },

        async fetchData() {
            try {
                const usersCollection = collection(db, 'users');
                onSnapshot(usersCollection, async (snapshot) => {
                    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), bets: [] }));

                    console.log('Fetched users:', users);

                    const betsCollection = collection(db, 'scommesse');
                    const betsSnapshot = await getDocs(betsCollection);
                    const bets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    console.log('Fetched bets:', bets);

                    for (const user of users) {
                        for (const bet of bets) {
                            if (bet.users && bet.users[user.email]) {
                                user.bets.push({ id: bet.id, title: bet.title, amount: bet.users[user.email] });
                            }
                        }
                    }

                    console.log('Processed users:', users);

                    this.users = users;
                });
            } catch (error) {
                console.error(error);
            }
        },
    },
}

</script>

<style scoped>
.container {
    font-family: Arial, sans-serif;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #4CAF50;
    color: white;
}

tr:hover {
    background-color: #4d4b4b;
}

li {
    list-style-type: none;
    margin-bottom: 10px;
}

.subtitle {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: transform 0.3s ease;
    display: inline-block;
}

.subtitle:hover {
    cursor: pointer;
    background-color: red;
    color: white;
    transform: scale(1.5);
}

#money {
    color: #00ff22;
}

.paginona {
    max-height: 67vh;
}
</style>
