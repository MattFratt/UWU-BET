import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

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
const auth = getAuth(app); // Ottieni l'istanza di Auth
const db = getFirestore(app); // Aggiunta dell'istanza di Firestore

export { app, analytics, db, auth }; // Esporta anche l'istanza di Firestore