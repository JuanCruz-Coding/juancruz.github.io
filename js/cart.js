// js/cart.js

import { renderCart } from "./cartUI.js";

// Este array guardará los productos del carrito.
let cart = [];

// Obtén el modal de Bootstrap y el ícono del carrito
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const cartIcon = document.getElementById("cart-icon");
const cartCountElement = document.getElementById("cart-count"); // Obtén el elemento del contador

/**
 * Actualiza el contador de productos en el icono del carrito.
 */
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
    cartCountElement.textContent = totalItems;
}

/**
 * Muestra el estado actual del carrito en la consola.
 */
function displayCart() {
    console.log("Carrito actual:", cart);
}

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 * @param {object} product - El objeto del producto a agregar.
 */
function addToCart(product) {
    if (product) {
        // 1. Busca si el producto ya existe en el carrito
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            // 2. Si el producto ya existe, incrementa la cantidad
            existingItem.cantidad++;
        } else {
            // 3. Si el producto es nuevo, lo agrega con cantidad 1
            product.cantidad = 1;
            cart.push(product);
        }
        
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Producto añadido al carrito"
        });

        console.log(`¡${product.nombre} añadido al carrito!`);
        displayCart();
        renderCart(cart);
        updateCartCount(); // Llama a la función para actualizar el contador
    }
}

/**
 * Elimina un producto del carrito.
 * @param {string} productId - El ID del producto a eliminar.
 */
function removeFromCart(productId) {
    // 1. Busca el índice del producto en el array del carrito
    const itemIndex = cart.findIndex((item) => item.id === productId);

    // 2. Si el producto existe (el índice no es -1)
    if (itemIndex !== -1) {
        // 3. Elimina un solo elemento en la posición encontrada
        cart.splice(itemIndex, 1);
        console.log(`Producto con ID ${productId} eliminado del carrito.`);

        // 4. Llama a renderCart para actualizar la interfaz
        renderCart(cart);
        updateCartCount(); // Llama a la función para actualizar el contador
    }
}

function clearCart() {
    cart = []; // <-- Se reasigna el array a uno vacío
    console.log("El carrito ha sido vaciado.");
    renderCart(cart); // <-- Se actualiza la interfaz
    updateCartCount(); // Llama a la función para actualizar el contador
    cartModal.hide();
}

const checkoutBtn = document.getElementById("checkout-btn");

function generateWhatsAppMessage() {
  event.preventDefault();
    if (cart.length === 0) {
        Swal.fire({
            title: "Atención!",
            text: "El carrito está vacío. Agrega productos antes de realizar un pedido.",
            icon: "warning",
            confirmButtonText: "Volver",
        });
        return;
    }

    let message = "¡Hola! Me gustaría hacer un pedido:\n\n";
    let total = 0;

    cart.forEach((item) => {
        message += `- ${item.nombre} (x${item.cantidad}) - $${(
            item.precio * item.cantidad
        ).toFixed(2)}\n`;
        total += item.precio * item.cantidad;
    });

    message += `\nTotal: $${total.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "5493412550031";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

export function initCart(products) {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    cartIcon.addEventListener("click", () => {
        renderCart(cart);
        cartModal.show();
    });

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.dataset.id;
            const productToAdd = products.find((product) => product.id === productId);
            addToCart(productToAdd);
        });
    });

    const cartItemsList = document.getElementById("cart-items-list");

    cartItemsList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-from-cart-btn")) {
            const productId = event.target.dataset.id;
            removeFromCart(productId);
        }
    });

    const clearCartBtn = document.getElementById("clear-cart-btn");
    clearCartBtn.addEventListener("click", clearCart);
    checkoutBtn.addEventListener("click", generateWhatsAppMessage);
}