const { ObjectId } = require("mongodb");
const { obtenerBaseDatos } = require("../database/conexion");


// Obtiene la colección "solicitudes" de MongoDB.
function obtenerColeccion() {
    return obtenerBaseDatos().collection("solicitudes");
}


// Convierte un ID recibido como texto al tipo ObjectId de MongoDB.
function convertirId(id) {
    return new ObjectId(id);
}


// CREATE: guarda una nueva solicitud de participación.
async function crearSolicitud(datos) {

    const resultado = await obtenerColeccion().insertOne(datos);

    // Devuelve el identificador que MongoDB asignó a la solicitud.
    return resultado.insertedId.toString();
}


// READ: busca una solicitud por su identificador.
async function buscarPorId(id) {

    return await obtenerColeccion().findOne({
        _id: convertirId(id)
    });
}


// READ: busca las solicitudes realizadas por un usuario.
async function buscarPorUsuario(usuarioId) {

    // find() obtiene las solicitudes del usuario.
    // sort() muestra primero las más recientes.
    // toArray() convierte los resultados en una lista de JavaScript.
    return await obtenerColeccion()
        .find({ usuarioId })
        .sort({ fechaCreacion: -1 })
        .toArray();
}


// READ: busca las solicitudes relacionadas con una iniciativa.
async function buscarPorIniciativa(iniciativaId, estado = "") {

    // Si recibimos un estado, lo agregamos al filtro.
    const filtro = { iniciativaId };

    if (estado) {
        filtro.estado = estado;
    }

    return await obtenerColeccion()
        .find(filtro)
        .sort({ fechaCreacion: -1 })
        .toArray();
}


// READ: comprueba si un usuario ya tiene una solicitud pendiente para una iniciativa.
async function buscarPendiente(iniciativaId, usuarioId) {

    // findOne() devuelve la solicitud si existe o null si no existe.
    return await obtenerColeccion().findOne({
        iniciativaId,
        usuarioId,
        estado: "pendiente"
    });
}


// UPDATE: modifica una solicitud existente.
async function actualizarSolicitud(id, filtro, cambios, sesion = null) {

    // La sesión permite incluir esta operación en una transacción.
    // Si no recibimos una sesión, la función trabaja normalmente.
    const opciones = sesion ? { session: sesion } : {};

    const resultado = await obtenerColeccion().updateOne(
        {
            _id: convertirId(id),
            ...filtro
        },
        {
            $set: cambios
        },
        opciones
    );

    // matchedCount indica si encontró una solicitud que cumpliera todas las condiciones.
    return resultado.matchedCount;
}



// Crea un índice para evitar dos solicitudes pendientes
// del mismo usuario en una misma iniciativa.
async function crearIndiceSolicitudes() {

    // unique: true impide que se repita la combinación.
    // partialFilterExpression aplica la restricción
    // solamente a las solicitudes con estado "pendiente".
    //
    // Así un usuario puede conservar una solicitud rechazada
    // y realizar una nueva solicitud posteriormente.
    await obtenerColeccion().createIndex(
        {
            iniciativaId: 1,
            usuarioId: 1
        },
        {
            unique: true,
            partialFilterExpression: {
                estado: "pendiente"
            }
        }
    );
}


// Agrega un usuario a los miembros de una iniciativa.
async function agregarMiembro(iniciativaId, propietarioId, usuarioId, sesion) {

    const resultado = await obtenerBaseDatos()
        .collection("iniciativas")
        .updateOne(
            {
                _id: convertirId(iniciativaId),
                propietarioId,
                estado: "abierta"
            },
            {
                // $addToSet agrega el usuario solo si todavía no está en la lista.
                $addToSet: {
                    miembros: usuarioId
                },
                $set: {
                    fechaModificacion: new Date()
                }
            },
            {
                session: sesion
            }
        );

    return resultado.matchedCount;
}

// Exportamos las funciones para utilizarlas desde solicitudes.service.js.
module.exports = {
    crearSolicitud,
    buscarPorId,
    buscarPorUsuario,
    buscarPorIniciativa,
    buscarPendiente,
    actualizarSolicitud,
    crearIndiceSolicitudes,
    agregarMiembro
};