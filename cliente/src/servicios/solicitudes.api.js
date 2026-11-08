// Dirección principal del backend para trabajar con solicitudes.
// Todas las operaciones de este archivo utilizarán esta dirección.
// Debe coincidir con la ruta configurada en server.js.
const API_URL = "http://localhost:3001/api/solicitudes";


// Esta función permite enviar peticiones al backend.
// La utilizaremos para no repetir el mismo código en cada operación.
async function enviarSolicitud(ruta, token, metodo = "GET", datos = null) {

    // Prepara las opciones que necesita fetch para comunicarse con el servidor.
    const opciones = {

        // Indica qué operación queremos realizar: GET, POST, PUT o PATCH.
        method: metodo,

        // Envía el token para que el backend identifique al usuario.
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // Comprueba si necesitamos enviar información al backend.
    // Por ejemplo, el motivo y la disponibilidad de una solicitud.
    if (datos !== null) {

        // Indica que los datos se enviarán en formato JSON.
        opciones.headers["Content-Type"] = "application/json";

        // Convierte el objeto de JavaScript a texto JSON.
        opciones.body = JSON.stringify(datos);
    }

    // Envía la petición al backend y espera la respuesta.
    // Une la dirección principal con la ruta específica.
    const respuesta = await fetch(`${API_URL}${ruta}`, opciones);

    // Convierte la respuesta JSON en un objeto de JavaScript.
    const resultado = await respuesta.json();

    // Comprueba si el servidor respondió con un error.
    if (!respuesta.ok) {

        // Muestra el mensaje que devuelve el backend.
        // Si no existe, utiliza un mensaje general.
        throw new Error(
            resultado.error?.mensaje ||
            resultado.mensaje ||
            "No se pudo completar la operación."
        );
    }

    // Devuelve los datos cuando la operación fue correcta.
    return resultado;
}


// CREATE: permite solicitar participación en una iniciativa.
export async function crearSolicitud(token, iniciativaId, datos) {

    // Envía una petición POST con los datos del formulario.
    const resultado = await enviarSolicitud(
        `/iniciativas/${iniciativaId}`,
        token,
        "POST",
        datos
    );

    // Devuelve solamente la solicitud creada.
    return resultado.solicitud;
}


// READ: consulta las solicitudes realizadas por el usuario.
export async function obtenerMisSolicitudes(token) {

    // Envía una petición GET para consultar las solicitudes.
    const resultado = await enviarSolicitud(
        "/mis-solicitudes",
        token
    );

    // Devuelve la lista de solicitudes del usuario.
    return resultado.solicitudes;
}


// READ: consulta las solicitudes recibidas por una iniciativa.
// Esta operación solamente está permitida para su propietario.
export async function obtenerSolicitudesIniciativa(
    token,
    iniciativaId,
    estado = ""
) {

    // Comprueba si el usuario seleccionó un estado para filtrar.
    // Si no seleccionó ninguno, se consultan todas las solicitudes.
    const parametros = estado
        ? `?estado=${encodeURIComponent(estado)}`
        : "";

    // Envía una petición GET con el ID de la iniciativa.
    const resultado = await enviarSolicitud(
        `/iniciativas/${iniciativaId}${parametros}`,
        token
    );

    // Devuelve las solicitudes recibidas por esa iniciativa.
    return resultado.solicitudes;
}


// UPDATE: permite editar una solicitud pendiente.
export async function editarSolicitud(token, id, datos) {

    // Envía una petición PUT con los nuevos datos.
    const resultado = await enviarSolicitud(
        `/${id}`,
        token,
        "PUT",
        datos
    );

    // Devuelve la solicitud con los cambios guardados.
    return resultado.solicitud;
}


// UPDATE: permite cancelar una solicitud pendiente.
export async function cancelarSolicitud(token, id) {

    // Envía una petición PATCH para cambiar su estado a cancelada.
    // No necesitamos enviar datos adicionales.
    const resultado = await enviarSolicitud(
        `/${id}/cancelar`,
        token,
        "PATCH"
    );

    // Devuelve la confirmación enviada por el backend.
    return resultado;
}


// UPDATE: permite aceptar o rechazar una solicitud.
// Esta operación solamente la puede realizar el propietario.
export async function revisarSolicitud(token, id, decision) {

    // Envía una petición PATCH con la decisión del propietario.
    const resultado = await enviarSolicitud(
        `/${id}/revisar`,
        token,
        "PATCH",
        { decision }
    );

    // Devuelve la solicitud con su nuevo estado.
    return resultado.solicitud;
}