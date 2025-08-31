import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

window.addEventListener("DOMContentLoaded", () => {
  const profileMenu = document.getElementById("profileMenu");
  const loginMenu = document.getElementById("loginMenu");

  if (!profileMenu || !loginMenu) return; // avoid errors if not found

  onAuthStateChanged(auth, (user) => {
    if (user) {
      profileMenu.style.display = "block";
      loginMenu.style.display = "none";
    } else {
      profileMenu.style.display = "none";
      loginMenu.style.display = "block";
    }
  });
});