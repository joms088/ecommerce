import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5T13AA9RwkEGtialWm6ESOpJoDcEu8cA",
  authDomain: "clothing-9944c.firebaseapp.com",
  projectId: "clothing-9944c",
  storageBucket: "clothing-9944c.firebasestorage.app",
  messagingSenderId: "288730777920",
  appId: "1:288730777920:web:cadd25379c20a922f312a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification ,signOut,
        setDoc, doc };

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const signupFullname = document.getElementById("signupFullname").value;
    const signupUsername = document.getElementById("signupUsername").value;
    const signupEmail = document.getElementById("signupEmail").value;
    const signupPassword = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);
        alert("Email Verification sent!");

        // Prepare user data
        const userData = {
          fullname: signupFullname,
          username: signupUsername,
          email: signupEmail,
          Password: signupPassword,
          createdAt: new Date()
        };

        // Save to Firestore
        await setDoc(doc(db, "users", user.uid), userData);

        alert("Account Created Successfully!");
        // window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Signup Error:", error.message);
        alert(error.message);
      })
      .catch((error) =>{
        const errorCode = error.code;
        if(errorCode == "auth/email-alreday-in-use"){
            showMessage("Email Address Already Exists", "signUpMessage");
        }else{
            showMessage("Unable to Create User", "signUpMessage");
        }
      });
  });

  // Login functionality
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        if (!user.emailVerified) {
          alert("Please verify your email before logging in.");
          signOut(auth);
          return;
        }

        alert("Login successful!");
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href = "/rose/dashboard.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
          showMessage("Incorrect Email or Password", "signInMessage");
        } else {
          showMessage("Account does not exist", "signInMessage");
        }
      });
  });
});
