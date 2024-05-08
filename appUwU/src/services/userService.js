// userService.js
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Funzione per caricare tutti gli utenti dal database Firestore
export async function loadUsers() {
  const usersCollection = collection(db, 'users');
  const querySnapshot = await getDocs(usersCollection);
  const users = [];
  querySnapshot.forEach((doc) => {
    // Aggiungi ogni utente all'array degli utenti
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
}
