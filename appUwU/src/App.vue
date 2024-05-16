<template>
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
</style>
