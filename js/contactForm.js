export function setupContactForm(){
    const contactForm = document.getElementById("contact-form");
    
    // Agregamos un event listener para el evento 'submit'
    contactForm.addEventListener("submit", (event) => {
        // Previene el comportamiento predeterminado del formulario,
        // que es recargar la página.
        event.preventDefault();
        
        // Obtiene los valores de los campos del formulario
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        
        // Muestra los datos en la consola para verificación
        console.log("Datos del formulario:");
        console.log("Nombre:", name);
        console.log("Correo Electrónico:", email);
        console.log("Mensaje:", message);
        
        // Muestra una alerta de confirmación al usuario
        alert("¡Mensaje enviado correctamente! Gracias por contactarnos.");
        
        // Opcional: Limpia el formulario después de enviarlo
        contactForm.reset();
    });
}