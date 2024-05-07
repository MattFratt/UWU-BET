<template>
  <div id="app">
    <header>
      <h1>Scommesse UwU</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <p>© Via Circonvallazione 57</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
/* Stili specifici per l'applicazione */
/* Puoi aggiungere stili globali qui se necessario */
#app {
  font-family: Arial, sans-serif;
  /* Aggiungi altri stili dell'applicazione qui */
}

header {
  background-color: #333;
  color: #fff;
  padding: 10px;
}

header h1 {
  margin: 0;
}

main {
  padding: 20px;
}

footer {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
}
</style>
