// Logout function
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                await signOut(auth);
                localStorage.removeItem("loggedInUserId");
                alert("Logged out successfully");
                window.location.href = "login_signup.html";
            } catch (error) {
                console.error("Error during logout:", error);
                alert("Failed to log out. Please try again.");
            }
        });
    }
});