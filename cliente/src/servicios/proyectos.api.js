const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

// Consulta los proyectos del usuario que inició sesión.
export async function obtenerProyectos(token) {

    // Envía una petición GET al servidor.
    const respuesta = await fetch(API_URL, {
        method: "GET",
        headers: {
            // Envía el token para comprobar la identidad del usuario.
            Authorization: `Bearer ${token}`
        }
    });

    // Convierte la respuesta del servidor a un objeto de JavaScript.
    const datos = await respuesta.json();

    // Si ocurrió un error, muestra un mensaje.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudieron cargar los proyectos."
        );
    }

    // Devuelve la lista de proyectos.
    return datos.proyectos;
}

// Consulta la información de un proyecto específico.
export async function obtenerDetalleProyecto(token, id) {

    // Envía el ID del proyecto en la dirección.
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const datos = await respuesta.json();

    // Comprueba si el servidor encontró el proyecto.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudo consultar el proyecto."
        );
    }

    // Devuelve los datos del proyecto encontrado.
    return datos.proyecto;
}

// Convierte una iniciativa existente en un proyecto.
export async function convertirEnProyecto(
    token,
    iniciativaId,
    datosProyecto
) {

    // Envía los datos al servidor mediante POST.
    const respuesta = await fetch(
        `${API_URL}/desde-iniciativa/${iniciativaId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            // Convierte los datos del formulario a JSON.
            body: JSON.stringify(datosProyecto)
        }
    );

    const datos = await respuesta.json();

    // Muestra un error si la conversión no se pudo realizar.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudo convertir la iniciativa."
        );
    }

    // Devuelve el proyecto creado.
    return datos.proyecto;
}