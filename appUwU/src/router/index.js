import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AddBet from '../views/AddBet.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Account from '../views/Account.vue';
import Users from '../views/Utenti.vue';
import Ruota from '../views/Ruota.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/add-bet', name: 'AddBet', component: AddBet },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/account', name: 'Account', component: Account },
  { path: '/users', name: 'Users', component: Users },
  { path: '/ruota', name: 'Ruota', component: Ruota }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
