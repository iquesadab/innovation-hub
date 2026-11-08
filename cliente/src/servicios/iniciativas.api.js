const API_URL = "http://localhost:3001/api/initiatives";

// Consulta las iniciativas utilizando el token y los filtros.
export async function obtenerIniciativas(token, filtros = {}) {

    // Prepara los parámetros que enviaremos en la URL.
    const parametros = new URLSearchParams();

    // Agrega solamente los filtros que tengan algún valor.
    if (filtros.q) {
        parametros.set("q", filtros.q);
    }

    if (filtros.type) {
        parametros.set("type", filtros.type);
    }

    if (filtros.category) {
        parametros.set("category", filtros.category);
    }

    if (filtros.skill) {
        parametros.set("skill", filtros.skill);
    }

    // Define la página y la cantidad de resultados.
    parametros.set("page", String(filtros.page || 1));
    parametros.set("size", String(filtros.size || 12));

    // Construye la URL con los filtros seleccionados.
    const url = `${API_URL}?${parametros.toString()}`;

    // Envía la solicitud al backend con el token.
    const respuesta = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Convierte la respuesta a un objeto JavaScript.
    const datos = await respuesta.json();

    // Comprueba si ocurrió algún error.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudieron cargar las iniciativas."
        );
    }

    // Devuelve las iniciativas y los datos de paginación.
    return datos;
}


// Consulta una iniciativa específica utilizando su ID.
export async function obtenerDetalleIniciativa(token, id) {

    // Envía la solicitud al backend con el token.
    const respuesta = await fetch(`${API_URL}/${id}`, {
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
            "No se pudo consultar la iniciativa."
        );
    }

    // Devuelve la iniciativa recibida del backend.
    return datos.iniciativa;
}


 // Envía una nueva iniciativa al backend para guardarla.
export async function crearIniciativa(token, iniciativa) {

    // Realiza una solicitud POST con los datos de la iniciativa.
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(iniciativa)
    });

    // Convierte la respuesta a un objeto JavaScript.
    const datos = await respuesta.json();

    // Muestra un error si el backend rechaza la solicitud.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            "No se pudo publicar la iniciativa."
        );
    }

    // Devuelve la iniciativa que se guardó en MongoDB.
    return datos.iniciativa;
}


 // UPDATE: permite modificar una iniciativa existente.
export async function actualizarIniciativa(token, id, cambios) {

    // Envía una petición PUT con los datos modificados.
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        // Envía el token y especifica que los datos son JSON.
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        // Convierte los cambios a formato JSON.
        body: JSON.stringify(cambios)
    });

    // Convierte la respuesta del backend en un objeto.
    const datos = await respuesta.json();

    // Si ocurre un error, muestra el mensaje del backend.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            datos.mensaje ||
            "No se pudo actualizar la iniciativa."
        );
    }

    // Devuelve la iniciativa actualizada.
    return datos.iniciativa;
}


// DELETE: solicita eliminar una iniciativa existente.
export async function eliminarIniciativa(token, id) {

    // Envía una petición DELETE al backend.
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",

        // Envía el token para identificar al usuario.
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Lee la respuesta enviada por el backend.
    const datos = await respuesta.json();

    // Comprueba si ocurrió algún error.
    if (!respuesta.ok) {
        throw new Error(
            datos.error?.mensaje ||
            datos.mensaje ||
            "No se pudo eliminar la iniciativa."
        );
    }

    // Devuelve la confirmación del backend.
    return datos;
}
