import { cart, getCartTotal, removeFromCart, clearCart, getCartUnitCount, saveCart } from "../core/cart-state.js";
import { sendCheckout } from "../services/api.js";

const cartItemContainer = document.getElementById("cart-items-container");
const summaryTotal = document.getElementById("summary-total");
const summaryCount = document.getElementById("summary-count");
const checkOutForm = document.getElementById("checkout-form-page");
const confirmBtn = document.getElementById("confirm-btn");

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
    setupCheckout();
});

function renderCartPage() {
    if (cart.length === 0) {
        cartItemContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Tu carrito está vacío.</p>
                <a href="index.html" class="btn-primary" style="text-decoration: none;">Ir a comprar</a>
            </div>
        `;
        summaryCount.textContent = getCartUnitCount();
        summaryTotal.textContent = `$${getCartTotal()}`;
        return;
    }

    cartItemContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price} c/u</p>
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-subtotal">
                <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                <button class="delete-btn" data-id="${item.id}">
                    <i data-lucide="trash-2"></i> Eliminar
                </button>
            </div>
        </div>
    `).join("");

    cartItemContainer.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            const isPlus = btn.classList.contains("plus");
            handleQuantityChange(id, isPlus);
        });
    });

    cartItemContainer.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            handleRemove(id);
        });
    });

    summaryCount.textContent = getCartUnitCount();
    summaryTotal.textContent = `$${getCartTotal()}`;

    if (window.lucide) {
        lucide.createIcons();
    }
}

function handleQuantityChange(id, isPlus) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (isPlus) {
        item.quantity += 1;
    } else if (item.quantity > 1) {
        item.quantity -= 1;
    }

    saveCart();
    renderCartPage();
}

function handleRemove(id) {
    if (window.confirm("¿Estás seguro que deseas eliminar el producto del carrito?")) {
        removeFromCart(id);
        renderCartPage();
    }
}

function setupCheckout() {
    if (!checkOutForm) return;

    checkOutForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            window.alert("Tu carrito está vacío. Agrega productos antes de confirmar.");
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Procesando...";

        const result = await sendCheckout(cart);

        if (result) {
            window.alert(
                `¡Compra confirmada!\n\n` +
                `ID de pedido: ${result.id}\n` +
                `Total: $${result.total}\n` +
                `Productos: ${result.totalProducts}\n\n` +
                `Gracias por tu compra en GLOW & GRACE.`
            );
            clearCart();
            checkOutForm.reset();
            renderCartPage();
        } else {
            window.alert("Ocurrió un error al procesar la compra. Intenta de nuevo.");
        }

        confirmBtn.disabled = false;
        confirmBtn.textContent = "Confirmar Compra";
    });
}
