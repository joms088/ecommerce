import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDjERc0rIRt-WnHxZRUD7SjVQI0c1SzCho",
    authDomain: "riderauth.firebaseapp.com",
    projectId: "riderauth",
    storageBucket: "riderauth.firebasestorage.app",
    messagingSenderId: "941883237107",
    appId: "1:941883237107:web:049bf22becff9bb3640d86"
  };

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

//  Export functions and instances
export {
  app,
  auth,
  db,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setDoc,
  doc,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
};
