import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, doc, query, where, updateDoc, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


  const firebaseConfig = {
    apiKey: "AIzaSyDkquxadwdaZFcwBvYomaNIDTKWjLhPpc0",
    authDomain: "shoeproduct-b5351.firebaseapp.com",
    projectId: "shoeproduct-b5351",
    storageBucket: "shoeproduct-b5351.firebasestorage.app",
    messagingSenderId: "905330368293",
    appId: "1:905330368293:web:163db20ca9797ef4eac4cc"
  };


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = 'en'
    const db = getFirestore();
    const provider = new GoogleAuthProvider();
    // const storage = getStorage(app);
    export {app, auth, db, provider, signOut, createUserWithEmailAndPassword,
            signInWithEmailAndPassword, setDoc, collection, getDocs, doc,query, where, updateDoc,
            signInWithPopup, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, addDoc, onSnapshot };

document.addEventListener("DOMContentLoaded", () =>{
    const formOpenBtn = document.querySelector("#form-open"),
      home = document.querySelector(".home"),
      formContainer = document.querySelector(".form_container"),
      formCloseBtn = document.querySelector(".form_close"),
      signupBtn = document.querySelector("#signup"),
      loginBtn = document.querySelector("#login"),
      pwShowHide = document.querySelectorAll(".pw_hide");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
    icon.addEventListener("click", () => {
        let getPwInput = icon.parentElement.querySelector("input");
        if(getPwInput.type === "password"){
            getPwInput.type = "text";
            icon.classList.replace("uil-eye-slash", "uil-eye");
        } else {
            getPwInput.type = "password";
            icon.classList.replace("uil-eye", "uil-eye-slash");
        }
    });
});

signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.add("active");
});

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("active");
});

function showMessage(message, divId){
    var messageDiv= document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    }, 5000);
}

async function getNextUserId(db) {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  const existingIds = querySnapshot.docs
    .map(doc => Number(doc.id))
    .filter(id => !isNaN(id));

  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  return nextId;
}


// Signup functionality
const signup_btn = document.getElementById("signup_btn");
signup_btn.addEventListener("click", async (event) => {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const create_password = document.getElementById("create_password").value;
  const confirm_password = document.getElementById("confirm_password").value;

  if (create_password !== confirm_password) {
    showPopup("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, create_password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);
    showPopup("📩 Email Verification sent! Please check your inbox.", "success");

    // Generate clean numeric Firestore ID (1, 2, 3, ...)
    const nextId = await getNextUserId(db);

    const userData = {
      id: nextId,
      fullname: fullname,
      username: username,
      email: email,
      create_password: create_password,
      uid: user.uid // Keep for linking Auth and Firestore
    };

    // Store user data with numeric ID
    await setDoc(doc(db, "users", String(nextId)), userData);

    showPopup(" Account Created Successfully!", "success");
    formContainer.classList.remove("active");

  } catch (error) {
    console.error("Signup Error:", error);
    if (error.code === "auth/email-already-in-use") {
      showPopup(" Email Address Already Exists", "error");
    } else {
      showPopup(" Unable to Create User", "error");
    }
  }
});


// Login functionality
const login_btn = document.getElementById("login_btn");
login_btn.addEventListener("click", (event) =>{
    event.preventDefault();
    const login_email = document.getElementById("login_email").value;
    const login_password = document.getElementById("login_password").value;
    
    const auth = getAuth();

    signInWithEmailAndPassword(auth, login_email, login_password)
    .then((userCredential)=>{
        
        const user = userCredential.user;

        if(!user.emailVerified){
            showPopup("⚠️ Please verify your email before logging in.", "error");
            signOut(auth);
            return;
        }
        showPopup("Login is Successful", "success");
        setTimeout(() => {
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "ecommerce.html";
        }, 2500);
    })
    .catch((error)=>{
        const errorCode = error.code;
        if(errorCode === "auth/invalid-credential"){
            showPopup("Incorrect Email or Password", "error");
        }else{
            showPopup("⚠️ Account does not exist", "error");

        }
    });
});

// Google Sign in
const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function(){
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    localStorage.setItem("loggedInUserId", user.uid);
    window.location.href = "index.html";

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

})

// Logout function

// Forgot Password
function showPopup(message, type = "info") {
    let popup = document.createElement("div");
    popup.innerText = message;
    popup.className = "order-popup";

    // color style based on type
    if (type === "success") {
        popup.style.background = "green";
    } else if (type === "error") {
        popup.style.background = "red";
    } else {
        popup.style.background = "#333";
    }

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 100);
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 500);
    }, 4000);
}

const forgotPassword = document.getElementById("forgotPassword");
forgotPassword.addEventListener("click", (event) =>{
    event.preventDefault();
    const login_email = document.getElementById("login_email").value.trim();

    const auth = getAuth();

    if (!login_email) {
        showPopup("⚠️ Please enter your email first.", "error");
        return;
    }

    sendPasswordResetEmail(auth, login_email)
        .then(() => {
            showPopup("📩 Password reset email sent! Check your inbox.", "success");
        })
        .catch((error) => {
            showPopup("" + error.message, "error");
        });
});

// firestore Functionality


});
   