const cartCountSpan = document.getElementById("cart-count");

/**
 * Actualiza el contador del carrito en el icono del header.
 * @param {Array<object>} cartItems - El array de productos en el carrito.
 */
function updateCartCount(cartItems) {
    let totalItems = 0;
    cartItems.forEach(item => {
        totalItems += item.cantidad;
    });
    cartCountSpan.textContent = totalItems;
}

/**
 * Renderiza el contenido del carrito en la interfaz de usuario.
 * @param {Array<object>} cartItems - El array de productos en el carrito.
 */
export function renderCart(cartItems) {
    const cartItemsList = document.getElementById("cart-items-list");
    const cartTotalSpan = document.getElementById("cart-total");

    // 1. Limpia el contenido actual del carrito para evitar duplicados.
    cartItemsList.innerHTML = "";
    
    // Variable para calcular el total
    let total = 0;

    // 2. Itera sobre los productos del carrito
    cartItems.forEach(item => {
        // Crea un elemento de lista para cada producto
        const cartItemEl = document.createElement("li");
        cartItemEl.classList.add("cart-item");
        cartItemEl.innerHTML = `
            <span>${item.nombre}</span>
            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="remove-from-cart-btn" data-id="${item.id}">Eliminar</button>
        `;
        cartItemsList.appendChild(cartItemEl);

        // 3. Suma el precio de cada producto al total
        total += item.precio * item.cantidad;
    });

    // 4. Actualiza el total en el HTML
    cartTotalSpan.textContent = total.toFixed(2);
    updateCartCount(cartItems);
}

