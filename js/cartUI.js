// js/cartUI.js

/**
 * Renderiza la lista de productos en el carrito.
 * @param {Array<object>} cart - El array de productos en el carrito.
 */
export function renderCart(cart) {
    const cartItemsList = document.getElementById("cart-items-list");
    const cartTotalPrice = document.getElementById("cart-total-price");
    
    // Limpia la lista antes de renderizar
    cartItemsList.innerHTML = "";

    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `<p class="text-center text-muted">El carrito está vacío.</p>`;
    } else {
        cart.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("cart-item");
            li.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <p class="item-name">${item.nombre}</p>
                    <p class="item-quantity">Cantidad: ${item.cantidad}</p>
                    <p class="item-price">$${(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn btn btn-sm btn-danger" data-id="${item.id}">X</button>
            `;
            cartItemsList.appendChild(li);
            totalPrice += item.precio * item.cantidad;
        });
    }

    // Asegúrate de que este elemento exista en tu HTML
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
}