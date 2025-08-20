// js/cart.js

import { renderCart } from "./cartUI.js";

// Este array guardará los productos del carrito.
let cart = [];

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
  }
}

/**
 * Elimina un producto del carrito.
 * @param {string} productId - El ID del producto a eliminar (ahora un string).
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
  }
}

function clearCart() {
  cart = []; // <-- Se reasigna el array a uno vacío
  console.log("El carrito ha sido vaciado.");
  renderCart(cart); // <-- Se actualiza la interfaz
}

/**
 * Inicializa toda la lógica del carrito,
 * configurando los "event listeners" para los botones.
 * @param {Array<object>} products - La lista completa de productos.
 */

const cartSideBar = document.getElementById("cart-sidebar");
const cartIcon = document.getElementById("cart-icon");
const closeCartBtn = document.getElementById("close-cart-btn");

function toggleCart() {
  cartSideBar.classList.toggle("show");
}

// Obtener el enlace de "Realizar Pedido"
const checkoutBtn = document.getElementById("checkout-btn");

/**
 * Genera el mensaje para WhatsApp con los detalles del pedido.
 */
function generateWhatsAppMessage() {
  // Si el carrito está vacío, no generamos el mensaje.
  if (cart.length === 0) {
    // Evita que el enlace se abra automáticamente
    event.preventDefault();

    Swal.fire({
      title: "Atención!",
      text: "El carrito está vacío. Agrega productos antes de realizar un pedido.",
      icon: "warning",
      confirmButtonText: "Volver",
    });
    return;
  }

  // Encabezado del mensaje
  let message = "¡Hola! Me gustaría hacer un pedido:\n\n";
  let total = 0;

  // Recorre el carrito para añadir cada producto al mensaje
  cart.forEach((item) => {
    message += `- ${item.nombre} (x${item.cantidad}) - $${(
      item.precio * item.cantidad
    ).toFixed(2)}\n`;
    total += item.precio * item.cantidad;
  });

  // Añade el total al mensaje
  message += `\nTotal: $${total.toFixed(2)}`;

  // Codifica el mensaje para que sea una URL válida
  const encodedMessage = encodeURIComponent(message);

  // Aquí pon tu número de teléfono de WhatsApp (con el código de país)
  const whatsappNumber = "5493412550031";

  // Genera el enlace de WhatsApp
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

   // Abre la URL en una nueva pestaña.
   window.open(whatsappURL, '_blank');

  // Actualiza el atributo 'href' del enlace
  checkoutBtn.href = whatsappURL;
}

export function initCart(products) {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  cartIcon.addEventListener("click", toggleCart);
  closeCartBtn.addEventListener("click", toggleCart);

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // **CAMBIO IMPORTANTE AQUÍ**
      // Obtén el ID como un string, no como un número.
      const productId = event.target.dataset.id;

      // Usamos .find() para encontrar el producto en la lista original.
      const productToAdd = products.find((product) => product.id === productId);

      // Llamamos a la función addToCart con el producto encontrado.
      addToCart(productToAdd);
    });
  });

  const cartItemsList = document.getElementById("cart-items-list");

  // Delegación de eventos para los botones de eliminar
  cartItemsList.addEventListener("click", (event) => {
    // Verifica si el clic fue en un botón de eliminar
    if (event.target.classList.contains("remove-from-cart-btn")) {
      // Obtiene el ID del producto como un string
      const productId = event.target.dataset.id;
      // Llama a la función para eliminar el producto
      removeFromCart(productId);
    }
  });

  const clearCartBtn = document.getElementById("clear-cart-btn");

  // Event listener para el botón de vaciar carrito
  clearCartBtn.addEventListener("click", clearCart);

  // Event listener para el botón de "Realizar Pedido"
  checkoutBtn.addEventListener("click", generateWhatsAppMessage);
}