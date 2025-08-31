import { db, collection, getDocs } from "./firebase.js";

// Function to fetch products from Firestore
async function fetchProducts() {
    try {
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const products = {};
        
        productSnapshot.forEach(doc => {
            products[doc.id] = doc.data();
        });
        
        return products;
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        return {};
    }
}

// Function to dynamically render products
async function renderProducts() {
    const products = await fetchProducts();
    const productContainer = document.querySelector('.prod_container');
    if (!productContainer) {
        console.error("Product container not found!");
        return;
    }

    productContainer.innerHTML = ''; // Clear existing products
    const currentPage = window.location.pathname;
    const isEcommercePage = currentPage.includes('ecommerce.html');
    const productKeys = Object.keys(products);
    const maxProducts = isEcommercePage ? 8 : productKeys.length; // Limit to 8 for ecommerce.html

    productKeys.slice(0, maxProducts).forEach((productId, index) => {
        const product = products[productId];
        const productElement = document.createElement('div');
        productElement.classList.add('prod');
        productElement.innerHTML = `
            <img src="${product.images && product.images[0] ? product.images[0] : ''}" alt="${product.name || ''}">
            <div class="des">
                <span>${product.brand || ''}</span>
                <h5>${product.name || ''}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>${product.price || ''}</h4>
            </div>
           
        `;
        productContainer.appendChild(productElement);
    });
}

// Function to handle product clicks and navigate to product page
async function setupProductNavigation() {
    await renderProducts(); // Render products dynamically
    const products = await fetchProducts();
    const productElements = document.querySelectorAll('.prod');
    
    productElements.forEach((product, index) => {
        product.addEventListener('click', function(e) {
            e.preventDefault();
        
            const productKeys = Object.keys(products);
            const productId = productKeys[index];
            
            if (productId && products[productId]) {
                sessionStorage.setItem('selectedProduct', JSON.stringify(products[productId]));
                sessionStorage.setItem('selectedProductId', productId);
                
                window.location.href = 'sproduct.html';
            }
        });
    });
}

// Function to load product details on sproduct.html page
function loadProductDetails() {
    const productData = sessionStorage.getItem('selectedProduct');
    const productId = sessionStorage.getItem('selectedProductId');
    
    if (productData && productId) {
        const product = JSON.parse(productData);
        
        // Update main product image
        const mainImg = document.getElementById('MainImg');
        if (mainImg && product.images && product.images[0]) {
            mainImg.src = product.images[0];
        }
        
        // Update small images
        const smallImages = document.getElementsByClassName('small-img');
        for (let i = 0; i < smallImages.length && i < product.images.length; i++) {
            smallImages[i].src = product.images[i];
        }
        
        // Update product details
        const productDetails = document.querySelector('.single-prod-details');
        if (productDetails) {
            const brandElement = productDetails.querySelector('h6');
            const nameElement = productDetails.querySelector('h4');
            const priceElement = productDetails.querySelector('h2');
            const descriptionElement = productDetails.querySelector('span');
            
            if (brandElement) brandElement.textContent = `${product.brand || ''} Shoes`;
            if (nameElement) nameElement.textContent = product.name || '';
            if (priceElement) priceElement.textContent = product.price || '';
            if (descriptionElement) descriptionElement.textContent = product.description || '';
        }
        
        // Update page title
        document.title = `${product.name || 'Product'} - Nike Store`;
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', async function() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('shop.html') || currentPage.includes('ecommerce.html')) {
        await setupProductNavigation();
    } else if (currentPage.includes('sproduct.html')) {
        loadProductDetails();
    }
});

// Export functions for use in other scripts
window.setupProductNavigation = setupProductNavigation;
window.loadProductDetails = loadProductDetails;