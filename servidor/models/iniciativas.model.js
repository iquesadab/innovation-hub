const { ObjectId } = require("mongodb");

// Importamos la función que nos permite acceder a la base de datos que ya está conectada.
const { obtenerBaseDatos } = require("../database/conexion");


// Esta función obtiene la colección "iniciativas".
function obtenerColeccion() {
    return obtenerBaseDatos().collection("iniciativas");
}

// MongoDB utiliza identificadores de tipo ObjectId.
// Cuando recibimos un ID desde una URL, llega como texto.
// Esta función lo convierte al tipo que utiliza MongoDB.
function convertirId(id) {
    return new ObjectId(id);
}


// CREATE: guarda una iniciativa nueva.
async function crearIniciativa(datos) {

    // insertOne() inserta un documento en MongoDB.
    // "datos" contiene la información de la iniciativa.
    const resultado = await obtenerColeccion().insertOne(datos);

    // MongoDB genera automáticamente el campo _id.
    // insertedId contiene ese identificador.
    // toString() lo convierte a texto para enviarlo por la API.
    return resultado.insertedId.toString();
}


// READ: busca una iniciativa utilizando su ID.
async function buscarPorId(id) {

    // findOne() busca un único documento
    // convertirId() transforma el texto recibido en ObjectId
    // Si encuentra la iniciativa, devuelve sus datos y sino null
    return await obtenerColeccion().findOne({
        _id: convertirId(id)
    });
}


// READ: busca varias iniciativas.
async function listarIniciativas(filtro, pagina, limite) {

    // "filtro" contiene las condiciones de búsqueda
    // "pagina" indica qué página queremos consultar
    // "limite" indica cuántas iniciativas mostrar
    // Calculamos cuántos resultados debemos saltar
    //
    // Ejemplo: 10 iniciativas por página.
    // Página 1: saltar 0.
    // Página 2: saltar 10.
    // Página 3: saltar 20.
    const saltar = (pagina - 1) * limite;

    const iniciativas = await obtenerColeccion()
        // find() busca los documentos que cumplen el filtro.
        // Si filtro = {}, busca todas las iniciativas.
        .find(filtro)

        // sort() ordena los resultados.
        // -1 significa orden descendente.
        // Se muestran primero las iniciativas más recientes.
        //
        // Ordenado por _id para mantener un orden cuando dos iniciativas tienen la misma fecha.
        .sort({
            fechaCreacion: -1,
            _id: -1
        })

        // skip() omite los resultados de páginas anteriores
        .skip(saltar)

        // limit() indica la cantidad máxima de resultados.
        .limit(limite)

        // toArray() convierte los resultados en una lista de JavaScript que podemos recorrer.
        .toArray();

    // countDocuments() cuenta todas las iniciativas que cumplen el filtro
    const total = await obtenerColeccion()
        .countDocuments(filtro);

    // Devuelve las iniciativas y la cantidad total.
    return {
        iniciativas,
        total
    };
}


// UPDATE: modifica una iniciativa existente.
async function actualizarIniciativa(id, propietarioId, cambios) {

    // updateOne() modifica un documento de MongoDB.
    //
    // El primer objeto indica cuál documento buscamos.
    // El segundo indica qué cambios queremos realizar.
    const resultado = await obtenerColeccion().updateOne(
        {
            // Busca la iniciativa por su ID.
            _id: convertirId(id),

            // Además, comprueba que pertenezca al usuario.
            propietarioId
        },
        {
            // $set es una instrucción de MongoDB.
            // Modifica únicamente los campos enviados y conserva los demás datos.
            $set: cambios
        }
    );

    // matchedCount indica cuántos documentos coincidieron.
    // 1: encontró la iniciativa del propietario.
    // 0: no encontró una iniciativa que cumpliera ambas condiciones.
    return resultado.matchedCount;
}


// DELETE: elimina una iniciativa.
async function eliminarIniciativa(id, propietarioId) {

    // deleteOne() elimina un documento
    // Solamente puede coincidir una iniciativa que tenga ese ID y pertenezca a ese propietario.
    const resultado = await obtenerColeccion().deleteOne({
        _id: convertirId(id),
        propietarioId
    });

    // deletedCount indica cuántos documentos se eliminaron.
    // 1: se eliminó correctamente.
    // 0: no se eliminó ningún documento.
    return resultado.deletedCount;
}


// Comprueba si una iniciativa tiene solicitudes de participación.
async function tieneSolicitudes(id) {

    // Accedemos a la colección "solicitudes"
    // Esta colección se utiliza cuando se solicita participar en iniciativas
    const total = await obtenerBaseDatos()
        .collection("solicitudes")
        .countDocuments({
            iniciativaId: id
        });

    // Devuelve true si existe al menos una solicitud.
    // Devuelve false si no existe ninguna.
    return total > 0;
}


// Comprueba si una iniciativa ya se convirtió en proyecto.
async function tieneProyecto(id) {

    // Busca un proyecto que tenga como referencia el identificador de esta iniciativa.
    const proyecto = await obtenerBaseDatos()
        .collection("proyectos")
        .findOne({
            iniciativaId: id
        });

    return proyecto !== null;
}


 // Elimina a un integrante del equipo de una iniciativa.
async function eliminarMiembro(id, propietarioId, usuarioId) {

    const resultado = await obtenerColeccion().updateOne(
        {
            // Busca la iniciativa y comprueba quién es el propietario.
            _id: convertirId(id),
            propietarioId,

            // Comprueba que el usuario esté en el equipo.
            miembros: usuarioId
        },
        {
            // $pull elimina el usuario del arreglo miembros.
            $pull: {
                miembros: usuarioId
            },

            // Actualiza la fecha de modificación.
            $set: {
                fechaModificacion: new Date()
            }
        }
    );

    // Devuelve 1 si encontró y actualizó la iniciativa.
    // Devuelve 0 si no encontró una coincidencia.
    return resultado.modifiedCount;
}


// Exportamos las funciones para poder utilizarlas desde iniciativas.service.js.
module.exports = {
    crearIniciativa,
    buscarPorId,
    listarIniciativas,
    actualizarIniciativa,
    eliminarIniciativa,
    tieneSolicitudes,
    tieneProyecto,
    eliminarMiembro
};