function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Add count to all cart icons
    document.querySelectorAll('.uil-shopping-cart').forEach(icon => {
        if (totalQty > 0) {
            icon.setAttribute('data-count', totalQty);
        } else {
            icon.removeAttribute('data-count');
        }
    });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', updateCartCount);
