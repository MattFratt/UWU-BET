<template>
  <div id="app">
    <header>
      <div class="topnav">
        <router-link to="/"><img id="home"src="./assets/home.png"></router-link>
        <router-link to="/add-bet" id="add">Admin</router-link>
        <h1>UwU Bets</h1>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <p id="footer-content">© Via Circonvallazione 57</p>
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
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* This ensures that #app takes up at least the full height of the viewport */
}

header {
  background-color: #fff;
  color: #fff;
  padding: 5px;
border: 3px solid black;
}

header h1 {
  margin: 0;
  text-align: center;
  color: black;
}

main {
  padding: 20px;
}

footer {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
  margin-top: auto; /* This pushes the footer to the bottom */
}
#home{
  width: 45px;
  height: 40px;
  border: 0px solid black;
  border-radius: 20px;
}
#home:hover{
  background-color: gray;
}
#add{
  color: black;
  
  /*centered*/  
}

</style>
