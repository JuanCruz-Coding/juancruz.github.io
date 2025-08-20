const d = document;

export default function renderProducts(products) {
    const productListSection = document.getElementById("product-list");
    productListSection.innerHTML = "";

    const promises = products.map(product => {
        return new Promise((resolve) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product");
            productCard.classList.add("card");
            productCard.style.width = "18rem";
            productCard.innerHTML = `
                <img class="card-img-top" src="${product.imagen}" alt="${product.nombre}" loading="lazy">
                <div class="card-body">
                    <h3 class="card-title">${product.nombre}</h3>
                    <p class="description card-title">${product.descripcion}</p>
                    <p class="price">$${product.precio.toFixed(2)}</p>
                    <button class="add-to-cart-btn btn btn-primary" data-id="${product.id}">Añadir al Carrito</button>
                </div>
            `;

            const img = productCard.querySelector('img');
            img.onload = () => resolve(); // Resuelve la promesa cuando la imagen carga
            img.onerror = () => resolve(); // Resuelve la promesa incluso si hay un error

            productListSection.appendChild(productCard);
        });
    });

    // Devuelve todas las promesas para que main.js pueda esperar por ellas
    return Promise.all(promises);
}

/* 
 <img src="${product.imagen}" alt="${product.nombre}>
            <h3>${product.nombre}</h3>
            <p class="description">${product.descripcion}</p>
            <p>$${product.precio.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Agregar al carrito</button>

*/