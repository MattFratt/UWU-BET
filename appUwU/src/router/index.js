import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AddBet from '../views/AddBet.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/add-bet', name: 'AddBet', component: AddBet },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
