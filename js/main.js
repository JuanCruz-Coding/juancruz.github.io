const d = document;

import renderProducts from "./productList.js";
import { initCart } from "./cart.js";
import { setupContactForm } from "./contactForm.js"; // Import the contact form setup function

d.addEventListener("DOMContentLoaded", () => {
    fetch("./data/productos.json")
        .then(response => response.json())
        .then(products => {
            renderProducts(products);
            initCart(products);
            setupContactForm();
        })
        .catch(error => console.error("Error al cargar los productos:", error));
});