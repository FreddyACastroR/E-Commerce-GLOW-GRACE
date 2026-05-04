import { obtenerProductos } from "../services/api.js";
import { addToCart, getCartUnitCount } from "../core/cart-state.js";

let allProducts = [];

const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('product-search');
const cartCounter = document.getElementById('cart-counter');

document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts();
    updateCartCounter();
    setupEventsListeners();
});

async function fetchProducts() {
    allProducts = await obtenerProductos();
    renderProducts(allProducts);
}

function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `<p class="loader">No se encontraron productos</p>`;
        return;
    }

    productsGrid.innerHTML = products.map(product => {
        const originalPrice = (product.price * 1.25).toFixed(2);
        return `
        <div class="product-card">
            <div class="sale-badge">Oferta</div>
            <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3>${product.title}</h3>
                <div class="price-container">
                    <span class="old-price">$${originalPrice}</span>
                    <span class="product-price">$${product.price}</span>
                </div>
                <button class="btn-primary add-to-cart-btn" data-id="${product.id}">
                    Agregar al carrito
                </button>
            </div>
        </div>
        `;
    }).join("");

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            const product = allProducts.find(p => p.id === id);
            if (!product) return;

            addToCart(product);
            updateCartCounter();

            const goToCart = window.confirm(
                `"${product.title}" se agregó al carrito.\n\n¿Deseas ir al carrito ahora?`
            );
            if (goToCart) {
                window.location.href = "cart.html";
            }
        });
    });
}

function updateCartCounter() {
    if (cartCounter) {
        cartCounter.textContent = getCartUnitCount();
    }
}

function setupEventsListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => filterProducts(e.target.value));
    }
}

function filterProducts(filtro) {
    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(filtro.toLowerCase())
    );
    renderProducts(filtered);
}
