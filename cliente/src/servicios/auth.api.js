const API_URL = "http://localhost:3001/api/auth"; // Dirección de autenticación del backend.

// Envía el correo y la contraseña para iniciar sesión.
export async function iniciarSesion(correo, contrasena) {

    const respuesta = await fetch(`${API_URL}/login`, {
        method: "POST", // Envía datos al servidor.
        headers: {
            "Content-Type": "application/json" // Indica que enviamos JSON.
        },
        body: JSON.stringify({ correo, contrasena }) // Prepara las credenciales.
    });

    const datos = await respuesta.json(); // Lee la respuesta del servidor.

    if (!respuesta.ok) {
        throw new Error(datos.error?.mensaje || "No se pudo iniciar sesión.");
    }

    return datos; // Devuelve el token y los datos del usuario.
}

// Envía los datos para registrar un usuario nuevo.
export async function registrarUsuario(usuario) {

    const respuesta = await fetch(`${API_URL}/register`, {
        method: "POST", // Solicita crear una cuenta.
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario) // Convierte los datos del formulario a JSON.
    });

    const datos = await respuesta.json(); // Lee la respuesta del backend.

    if (!respuesta.ok) {
        throw new Error(datos.error?.mensaje || "No se pudo registrar el usuario.");
    }

    return datos; // Devuelve la respuesta del registro.
}