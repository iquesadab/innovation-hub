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
