import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AddBet from '../views/AddBet.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/add-bet', name: 'AddBet', component: AddBet }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
