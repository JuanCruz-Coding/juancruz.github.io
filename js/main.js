const d = document;

import renderProducts from "/js/productList.js";
import { initCart } from "./cart.js";

d.addEventListener("DOMContentLoaded", () => {
    fetch("data/productos.json")
        .then(response => response.json())
        .then(products => {
            renderProducts(products);
            initCart(products);
        })
        .catch(error => console.error("Error al cargar los productos:", error));
});