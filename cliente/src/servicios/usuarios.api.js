const API_URL = "http://localhost:3001/api/auth";

// Consulta los datos del usuario que inició sesión.
export async function obtenerPerfil(token) {

    // Envía el token para identificar al usuario.
    const respuesta = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Convierte la respuesta del servidor a un objeto.
    const datos = await respuesta.json();

    // Comprueba si ocurrió algún error.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudo consultar el perfil."
        );
    }

    // Devuelve la información del usuario.
    return datos.usuario;
}

// Actualiza los datos del perfil en MongoDB.
export async function actualizarPerfil(token, usuario) {

    // Envía los cambios al backend.
    const respuesta = await fetch(`${API_URL}/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
    });

    // Convierte la respuesta del servidor.
    const datos = await respuesta.json();

    // Comprueba si el backend rechazó la actualización.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudo actualizar el perfil."
        );
    }

    // Devuelve el usuario con los cambios guardados.
    return datos.usuario;
}
