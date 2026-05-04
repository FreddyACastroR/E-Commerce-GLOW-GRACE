import { storage } from "../services/storage.js";

export let cart = storage.getCarrito();

export function addToCart(product) {

    let item = cart.find(i => i.id === product.id);
    if (item) {
        item.quantity += 1;
    } else {
        item = { ...product, quantity: 1 };
        cart.push(item);
    }

    saveCart();
}

export function saveCart() {
    storage.setCarrito(cart);
}

export function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
}

export function clearCart() {
    cart = [];
    saveCart();
}

export function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

export function getCartUnitCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}