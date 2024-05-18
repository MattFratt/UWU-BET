import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.css'
//import '../src/style.css';


import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);

app.use(VueSweetalert2);

app.use(router);

app.mount('#app');

let originalTitle = document.title;
let titleInterval;

function scrollTitle() {
    const title = document.title;
    const newTitle = title.substring(1) + title.charAt(0);
    document.title = newTitle;
}

window.addEventListener('blur', function () {
    document.title = 'Torna😭🙏';
    clearInterval(titleInterval); // clear the interval when the page loses focus
});

window.addEventListener('focus', function () {
    document.title = originalTitle;
    titleInterval = setInterval(scrollTitle, 500); // set the interval when the page gains focus
});