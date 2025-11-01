import { getFirestore, collection, query, where, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { app, auth } from "./firebase.js";

const db = getFirestore(app);

// Store last known statuses
const lastStatuses = {};

// Popup function
function showPopup(message) {
  let popup = document.createElement("div");
  popup.innerText = message;
  popup.className = "order-popup";
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 100); 
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 500);
  }, 6000);
}

// Listen for order updates of the logged-in user
function listenForOrderUpdates(userId) {
  console.log("Listening for orders of:", userId);

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));

  onSnapshot(q, (snapshot) => {
    snapshot.forEach((doc) => {
      const order = doc.data();
      const orderId = doc.id;
      const prevStatus = lastStatuses[orderId];

      // Only show popup if status actually changed
      if (order.status !== prevStatus) {
        if (prevStatus !== undefined) {  
          if (order.status === "Confirmed") {
            showPopup("Your order has been confirmed!");
          } else if (order.status === "Rejected") {
            showPopup("Your order has been rejected.");
          } else if (order.status === "Pending") {
            showPopup("Your order is being processed. Please wait.");
          }
        }
        lastStatuses[orderId] = order.status; 
      }
    });
  });
}

// Wait for login
auth.onAuthStateChanged((user) => {
  if (user) {
    listenForOrderUpdates(user.uid);
  }
});
