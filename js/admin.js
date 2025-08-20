
// CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDiWKyZ1dDX4qxj2GdAPXusg7iGxPVui0M",
    authDomain: "mi-tienda-online-9e3bb.firebaseapp.com",
    projectId: "mi-tienda-online-9e3bb",
    storageBucket: "mi-tienda-online-9e3bb.firebasestorage.app",
    messagingSenderId: "264736889589",
    appId: "1:264736889589:web:85d0b7a00de2697c52c3bc",
    measurementId: "G-1DVFKCD7HS",
};

// Inicializa Firebase, Firestore, Auth y Storage
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

// VARIABLES GLOBALES Y ELEMENTOS DEL DOM
const productForm = document.getElementById("product-form");
let currentProduct = null; // Guarda el objeto completo del producto para edición

// FUNCIONES DE MANEJO DE LA BASE DE DATOS

/**
 * Renderiza la lista de productos en una tabla HTML.
 * @param {Array<object>} products - El array de productos.
 */
function renderProducts(products) {
    const productListSection = document.getElementById("admin-product-list");
    productListSection.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("admin-table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.imagen}" alt="${product.nombre}" class="table-image"></td>
            <td>${product.nombre}</td>
            <td>$${product.precio.toFixed(2)}</td>
            <td>
                <div class="product-actions">
                    <button class="edit-btn" data-id="${product.id}">Editar</button>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    productListSection.appendChild(table);
}

/**
 * Obtiene todos los productos de la base de datos de Firestore.
 */
async function getProducts() {
    try {
        const productsCol = db.collection('productos');
        const snapshot = await productsCol.get();
        const productsList = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        
        console.log("Productos cargados desde Firebase:", productsList);
        renderProducts(productsList);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

/**
 * Elimina un producto de la base de datos por su ID.
 * @param {string} productId - El ID del producto.
 */
async function deleteProduct(productId) {
    try {
        await db.collection("productos").doc(productId).delete();
        console.log("Documento eliminado con éxito!");
        getProducts();
    } catch (error) {
        console.error("Error al eliminar el documento:", error);
    }
}

/**
 * Agrega un nuevo producto a la base de datos.
 * @param {object} productData - El objeto con los datos del producto.
 * @param {File} imageFile - El archivo de la imagen.
 */
async function addProduct(productData, imageFile) {
    try {
        let imageUrl = '';
        if (imageFile) {
            const storageRef = storage.ref(`productos/${imageFile.name}`);
            const snapshot = await storageRef.put(imageFile);
            imageUrl = await snapshot.ref.getDownloadURL();
        }

        await db.collection("productos").add({ ...productData, imagen: imageUrl });
        console.log("Producto agregado con éxito!");
        getProducts();
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
}

/**
 * Actualiza un producto existente en la base de datos.
 * @param {string} productId - El ID del producto a actualizar.
 * @param {object} productData - Los nuevos datos del producto.
 * @param {File} imageFile - El archivo de la nueva imagen (opcional).
 */
async function updateProduct(productId, productData, imageFile) {
    try {
        let imageUrl = currentProduct.imagen;

        if (imageFile) {
            const storageRef = storage.ref(`productos/${imageFile.name}`);
            const snapshot = await storageRef.put(imageFile);
            imageUrl = await snapshot.ref.getDownloadURL();
        }

        await db.collection("productos").doc(productId).set({ ...productData, imagen: imageUrl });
        console.log("Producto actualizado con éxito!");
        getProducts();
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
    }
}

// MANEJADORES DE EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    getProducts();
});

// Manejador del clic en los botones de la lista de productos
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const productId = event.target.dataset.id;
        if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            deleteProduct(productId);
        }
    }

    if (event.target.classList.contains("edit-btn")) {
        const productId = event.target.dataset.id;
        
        const productRef = db.collection("productos").doc(productId);
        const doc = await productRef.get();
        if (doc.exists) {
            currentProduct = { id: doc.id, ...doc.data() }; // Guarda el objeto completo
            const productData = doc.data();
            
            document.getElementById("product-name").value = productData.nombre;
            document.getElementById("product-price").value = productData.precio;
            document.getElementById("product-description").value = productData.descripcion;
            
            document.getElementById("add-product-btn").textContent = "Guardar Cambios";
        }
    }
});

// Manejador del envío del formulario
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productData = {
        nombre: document.getElementById("product-name").value,
        precio: parseFloat(document.getElementById("product-price").value),
        descripcion: document.getElementById("product-description").value
    };
    
    const imageFile = document.getElementById("product-image").files[0];

    if (currentProduct) {
        updateProduct(currentProduct.id, productData, imageFile);
    } else {
        addProduct(productData, imageFile);
    }
    
    productForm.reset();
    currentProduct = null;
    document.getElementById("add-product-btn").textContent = "Agregar Producto";
});

// Lógica de autenticación y cierre de sesión
const logoutBtn = document.getElementById("logout-btn");

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "login.html";
    }
});

logoutBtn.addEventListener("click", async () => {
    try {
        await auth.signOut();
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});