<template>

  <aside class="menu">

    <p class="menu-label"><u>SCOMMESSE</u></p>
    <ul class="menu-list">
      <li><a>Schedina</a></li>
      <li><a>Lotto presenze</a></li>
      <li><a>Pagelle</a></li>
      <li><a>Promossi/Bocciati</a></li>
      <li><a>Voti verifiche</a></li>
      <li><a>Debiti?</a></li>
      <li><router-link to="/ruota">Ruota Matiellica</router-link></li>

    </ul>
    <p class="menu-label"><u>FLEXATORI</u></p>
    <!-- fare vfor con array (da creare) con i flexatori-->
    <p class="menu-label"><u>GAMBLER DELLA SETTIMANA</u> <br>(chi ha ballato più fresca)</p>
    <ul class="menu-list">
      <li><a>1. </a></li>
      <li><a>2. </a></li>
      <li><a>3. </a></li>
      <!-- stra da fare meglio-->
    </ul>
  </aside>


  <div id="app" class="has-navbar-fixed-top">
    <header class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="home-button">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span>Home</span>
          </span>
        </router-link>
        <h1 class="title">UwU Bets</h1>
        <div v-click-outside="hideDropdown" class="account-settings" style="position: relative;">
          <div class="dropdown" :class="{ 'is-active': dropdownIsActive }">
            <div class="dropdown-trigger">
              <button class="button" @click="accountHover">
                <span>Account</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">

                <router-link v-if="!isLoggedIn" class="dropdown-item" to="/register"
                  @click="hideDropdown">Registrati</router-link>

                <router-link v-if="!isLoggedIn" class="dropdown-item" to="/login"
                  @click="hideDropdown">Login</router-link>

                <router-link v-if="isAdmin" class="dropdown-item" to="/add-bet" id="admin"
                  @click="hideDropdown">ADMIN</router-link>

                <router-link v-if="isLoggedIn" class="dropdown-item" to="/account" id="admin" @click="hideDropdown">
                  <div class="icon-text">
                    <span class="icon has-text-info">
                      <i class="fas fa-info-circle"></i>
                    </span>
                    <span>info</span>
                  </div>
                </router-link>
                <router-link v-if="isAdmin" class="dropdown-item" to="/users" @click="hideDropdown">Utenti</router-link>
                <button v-if="isLoggedIn" class="dropdown-item" @click="logout" id="logout">Logout</button>

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
import { onBeforeUnmount } from 'vue';
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      dropdownIsActive: false,
    };
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      beforeUnmount(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    },
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
    },
    accountHover() {
      this.dropdownIsActive = !this.dropdownIsActive;
    },
    hideDropdown() {
      this.dropdownIsActive = false;
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

.navbar-content {
  display: flex;

  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}


.dropdown-content {
  max-width: fit-content;

}

.home-button {
  color: white;
}

.home-button:hover {

  transform: scale(1.3);
  background-color: rgb(86, 131, 255);

}

.title {
  color: white;
}

.account-settings {
  display: flex;
  align-items: center;
}

#logout {
  color: red;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  color: #000000;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 0.2vh;

  border-radius: 5px;
}

.menu {
  display: block;
  position: absolute;
  top: 10vh;
  width: 25vh;
  left: 0%;
  z-index: 20;
  background-color: rgba(255, 255, 255, 0.2);
  border-style: solid;
  border-width: 1vh;
  border-color: black;
  overflow-y: auto;
  max-height: 85.3%;
  bottom: 0;

}

.menu-label {
  padding-left: 1em;
  padding-top: 1em;
  color: #000000;
}
</style>
