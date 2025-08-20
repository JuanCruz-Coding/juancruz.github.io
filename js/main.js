// js/main.js

const d = document;

import renderProducts from "./productList.js";
import { initCart } from "./cart.js";
import { setupContactForm } from "./contactForm.js"; // Import the contact form setup function

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDiWKyZ1dDX4qxj2GdAPXusg7iGxPVui0M",
    authDomain: "mi-tienda-online-9e3bb.firebaseapp.com",
    projectId: "mi-tienda-online-9e3bb",
    storageBucket: "mi-tienda-online-9e3bb.firebasestorage.app",
    messagingSenderId: "264736889589",
    appId: "1:264736889589:web:85d0b7a00de2697c52c3bc",
    measurementId: "G-1DVFKCD7HS"
};

// Inicializa Firebase y Firestore
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

// Obtén el contenedor del spinner del DOM
const loaderContainer = d.getElementById("loader-container");

d.addEventListener("DOMContentLoaded", () => {
    async function getProducts() {
        if (loaderContainer) {
            loaderContainer.classList.remove("hidden");
        }
        
        try {
            const productsRef = db.collection('productos');
            const snapshot = await productsRef.get();
            const productsList = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            
            console.log("Productos cargados desde Firebase:", productsList);
            
            // Espera a que las imágenes se carguen antes de continuar
            await renderProducts(productsList);
            
            // Inicializa el carrito solo después de que todo esté listo
            initCart(productsList);
            
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        } finally {
            if (loaderContainer) {
                loaderContainer.classList.add("hidden");
            }
        }
    }
    
    getProducts();
    setupContactForm();
});