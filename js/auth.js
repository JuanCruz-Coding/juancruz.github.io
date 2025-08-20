// Configuración de Firebase (debes copiarla de tu admin.js)
const firebaseConfig = {
    apiKey: "AIzaSyDiWKyZ1dDX4qxj2GdAPXusg7iGxPVui0M",
    authDomain: "mi-tienda-online-9e3bb.firebaseapp.com",
    projectId: "mi-tienda-online-9e3bb",
    storageBucket: "mi-tienda-online-9e3bb.firebasestorage.app",
    messagingSenderId: "264736889589",
    appId: "1:264736889589:web:85d0b7a00de2697c52c3bc",
    measurementId: "G-1DVFKCD7HS"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore(); // ¡Importante! Necesitas Firestore para verificar el rol.

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// ID de tu usuario administrador
const ADMIN_UID = "19f2WSCmglQS7HpDhinOLJditYD2"; // Reemplaza con el UID real del admin

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = "";

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Comparamos el UID del usuario que inició sesión con el UID de administrador.
        if (user.uid === ADMIN_UID) {
            // Si es el administrador, lo llevamos al panel de admin.
            window.location.href = "admin.html";
        } else {
            // Si no es el administrador, lo llevamos a la página principal.
            window.location.href = "index.html";
        }

    } catch (error) {
        // Manejamos los errores
        let message = "";
        switch (error.code) {
            case 'auth/user-not-found':
                message = "Correo electrónico no registrado.";
                break;
            case 'auth/wrong-password':
                message = "Contraseña incorrecta.";
                break;
            default:
                message = "Error al iniciar sesión. Inténtalo de nuevo.";
        }
        errorMessage.textContent = message;
    }
});