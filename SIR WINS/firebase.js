import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
        signOut, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, doc, query, where, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBuK4MQMQhSDoL49GYF0-ESHtfF_kg77Ek",
    authDomain: "panebio.firebaseapp.com",
    projectId: "panebio",
    storageBucket: "panebio.firebasestorage.app",
    messagingSenderId: "595627555865",
    appId: "1:595627555865:web:ec4559c5477ff33562fe88"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore();
  export {app, auth, db, signOut, createUserWithEmailAndPassword,
            signInWithEmailAndPassword, setDoc, collection, getDocs, doc,query, where, updateDoc,
            sendEmailVerification, onAuthStateChanged, addDoc  };

function showMessage(message, divId){
  var messageDiv=document.getElementById(divId);
  messageDiv.style.display="block";
  messageDiv.innerHTML=message;
  messageDiv.style.opacity=1;
  setTimeout(function(){
    messageDiv.style.opacity=0;
  },5000);
}

// Registration
const submit=document.getElementById("registerBtn");
submit.addEventListener('click', (event)=>{
  event.preventDefault();
  const registerEmail= document.getElementById('registerEmail').value;
  const registerName= document.getElementById('registerName').value;
  const registerPassword= document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if(registerPassword !== confirmPassword){
    showMessage('Passwords do not match','signupMessage');
    return;
  }
 
  const auth=getAuth();
  const db=getFirestore();

  createUserWithEmailAndPassword(auth,registerEmail, registerPassword)
  .then((userCredential)=>{
    const user=userCredential.user;

    const auth = getAuth();
        sendEmailVerification(auth.currentUser)
        .then(() => {
            alert("Verification Email Sent Successfully. Please check your inbox.");
        })
        .catch((error) =>{
            console(error);
        });

    const userData={
      email: registerEmail,
      fname: registerName,
      password: registerPassword
    };
    showMessage('Account created successfully','signupMessage');
    const docRef=doc(db,"users", user.uid);
    setDoc(docRef,userData)
    .then(()=>{
      // window.location.href='register.html';
    })
    .catch((error)=>{
    console.error("error writing document", error);

    });
})

})

// Login
const login = document.getElementById("loginBtn");
login.addEventListener('click', (event)=>{
  event.preventDefault();
  const loginEmail= document.getElementById('loginEmail').value;
  const loginPassword= document.getElementById('loginPassword').value;

  const auth=getAuth();

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential)=>{
        
        const user = userCredential.user;

        if(!user.emailVerified){
            alert("Please verify your email before logging in.");
            signOut(auth);
            return;
        }
        alert("Login is Successful");
        setTimeout(() => {
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "homepage.html";
        }, 2500);
    })
    .catch((error)=>{
        const errorCode = error.code;
        if(errorCode === "auth/invalid-credential"){
            alert("Incorrect Email or Password");
        }else{
            alert("Account does not exist");

        }
    });
});