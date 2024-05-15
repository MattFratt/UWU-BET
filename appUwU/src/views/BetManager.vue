<template>
  <div>
    <h2>Manager di scommesse</h2>
    <!-- Form per aggiungere una nuova scommessa -->
    <form @submit.prevent="addBet">
      <label for="betName">Bet Name:</label>
      <input type="text" id="betName" v-model="newBetName" required>
      <button type="submit">Add Bet</button>
    </form>

    <!-- Elenco delle scommesse -->
    <ul>
      <li v-for="(bet, index) in bets" :key="index">
        {{ bet.title }}
        <button @click="removeBet(index)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'BetManager',
  data() {
    return {
      newBetName: '',
      bets: []
    };
  },
  methods: {
    addBet() {
      if (this.newBetName.trim() !== '') {
        this.bets.push({ name: this.newBetName });
        this.newBetName = '';
      }
    },
    removeBet(index) {
      this.bets.splice(index, 1);
    }
  }
};
</script>

<style scoped>
/* Stili specifici per il componente BetManager */
/* Puoi aggiungere stili specifici qui se necessario */
</style>
