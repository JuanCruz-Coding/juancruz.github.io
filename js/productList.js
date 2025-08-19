const d = document;

export default function renderProducts(products){
    const productList = d.getElementById("product-list");

    products.forEach(product => {
        const productDiv = d.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <h3>${product.nombre}</h3>
            <div class="image-container">
                <img src="${product.imagen}" alt="${product.nombre}">
            </div>
            <p class="description">${product.descripcion}</p>
            <p>$${product.precio.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Agregar al carrito</button>
            `;
        productList.appendChild(productDiv);
    });
}

/* 
 <img src="${product.imagen}" alt="${product.nombre}>
            <h3>${product.nombre}</h3>
            <p class="description">${product.descripcion}</p>
            <p>$${product.precio.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Agregar al carrito</button>

*/