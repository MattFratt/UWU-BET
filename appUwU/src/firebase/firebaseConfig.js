import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGg52vVmjcc2gVEpZb3v_cWPIIG5DStQQ",
    authDomain: "uwuapp-7d12c.firebaseapp.com",
    projectId: "uwuapp-7d12c",
    storageBucket: "uwuapp-7d12c.appspot.com",
    messagingSenderId: "1060724599957",
    appId: "1:1060724599957:web:25ac3c87a2dee460917f9c",
    measurementId: "G-89MDSYYB7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Aggiunta dell'istanza di Firestore

export { app, analytics, db }; // Esporta anche l'istanza di Firestore