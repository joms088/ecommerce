import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        GoogleAuthProvider, signInWithPopup, sendEmailVerification, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


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
            signInWithEmailAndPassword, setDoc, collection, getDocs, doc, signInWithPopup,
            sendEmailVerification, sendPasswordResetEmail };

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

// Signup functionality
const signup_btn = document.getElementById("signup_btn");
signup_btn.addEventListener("click", (event) => {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const create_password = document.getElementById("create_password").value;
    const confirm_password = document.getElementById("confirm_password").value;

     if (create_password !== confirm_password) {
         alert("Passwords do not match!");
         return;
     }

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, create_password)
    .then((userCredential)=>{
        const user = userCredential.user;

        const auth = getAuth();
        sendEmailVerification(auth.currentUser)
        .then(() => {
            alert("Email Verification send!!");
        })
        .catch((error) =>{
            console.error("Error sending Email Verification:", error);
        });

        const userData = {
            fullname: fullname,
            username: username,
            email: email,
            create_password: create_password

        }
        showMessage("Account Created Succesfully", "signUpMessage");
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() =>{
            // window.location.href = "index.html";
            formContainer.classList.remove("active");
        })
        .catch((error) =>{
            console.error("error writing document", error);

        });
    })
    .catch((error) =>{
        const errorCode = error.code;
        if(errorCode == "auth/email-alreday-in-use"){
            showMessage("Email Address Already Exists", "signUpMessage");
        }else{
            showMessage("Unable to Create User", "signUpMessage");
        }
    })
    
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
            alert("Please verify your email before logging in.");
            signOut(auth);
            return;
        }
        showMessage("Login is Successful", "signInMessage");
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href = "ecommerce.html";
    })
    .catch((error)=>{
        const errorCode = error.code;
        if(errorCode === "auth/invalid-credential"){
            showMessage("Incorrect Email or Password", "signInMessage");
        }else{
            showMessage("Account does not exixts", "signInMessage");
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
const forgotPassword = document.getElementById("forgotPassword");
forgotPassword.addEventListener("click", (event) =>{
    event.preventDefault();
    const login_email = document.getElementById("login_email").value;

    const auth = getAuth();
    sendPasswordResetEmail(auth, login_email)
        .then(() => {
            alert("Email sent.");
    })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
  });
});

// firestore Functionality


});
   