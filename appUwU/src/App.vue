<template>
  <div id="app" class="has-navbar-fixed-top">
    <header class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item"><img id="home" src="./assets/home.png"></router-link>
        <router-link v-if="isAdmin" to="/add-bet" id="add" class="navbar-item">Admin</router-link>
        <h1 class="title is-4 navbar-item">UwU Bets</h1>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="dropdown" :class="{ 'is-active': dropdownIsActive }">
            <div class="dropdown-trigger">
              <button class="button" @click="dropdownIsActive = !dropdownIsActive" aria-haspopup="true"
                aria-controls="dropdown-menu"> <span>Account</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <router-link v-if="!isLoggedIn" class="dropdown-item" to="/login">Login</router-link>
                <router-link v-if="!isLoggedIn" class="dropdown-item" to="/register">Registrati</router-link>
                <hr class="dropdown-divider">
                <router-link v-if="isLoggedIn" class="dropdown-item" to="/account">Account</router-link>
                <a v-if="isLoggedIn" class="dropdown-item" @click="logout">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="section">
      <router-view></router-view>
    </main>
    <footer class="footer py-2">
      <div class="content has-text-centered">
        <p id="footer-content">© Via Circonvallazione 57</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth } from './firebase/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      dropdownIsActive: false,
    };

  },
  setup() {
    const currentUserEmail = ref(null);
    const isAdmin = ref(false);

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUserEmail.value = user.email;
          isAdmin.value = user.email === 'admin@gmail.com';
        } else {
          currentUserEmail.value = null;
          isAdmin.value = false;
        }
      });
    });

    return {
      isAdmin
    };
  },
  async mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserEmail = user.email;
        this.isLoggedIn = true;
      } else {
        this.currentUserEmail = null;
        this.isLoggedIn = false;
      }
    });
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.isLoggedIn = false;
      }).catch((error) => {
        console.error('Error logging out:', error);
      });
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#home {
  width: 45px;
  height: 40px;
  border: 0px solid black;
  border-radius: 20px;
}

#home:hover {
  background-color: gray;
}

#add {
  color: black;
  text-decoration: none;
  animation: colorChange 2s infinite;
}

@keyframes colorChange {
  0% {
    color: rgb(255, 0, 0);
  }

  33% {
    color: rgb(0, 255, 0);
  }

  66% {
    color: rgb(0, 0, 255);
  }

  100% {
    color: rgb(255, 0, 0);
  }
}

#add:hover {
  text-decoration: underline;
}


</style>