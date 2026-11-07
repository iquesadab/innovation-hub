const { ObjectId } = require("mongodb");

const { obtenerBaseDatos } = require("../database/conexion");

// Obtiene la colección de proyectos de MongoDB.
function obtenerColeccion() {
    return obtenerBaseDatos().collection("proyectos");
}

// Convierte un identificador de texto en ObjectId.
function convertirId(id) {
    return new ObjectId(id);
}

// CREATE: guarda un proyecto nuevo en MongoDB.
async function crearProyecto(datos, sesion = null) {

    // Si existe una sesión, la utiliza para la transacción.
    const opciones = sesion ? { session: sesion } : {};

    const resultado = await obtenerColeccion().insertOne(
        datos,
        opciones
    );

    return resultado.insertedId.toString();
}

// READ: busca un proyecto por su identificador.
async function buscarPorId(id) {

    return await obtenerColeccion().findOne({
        _id: convertirId(id)
    });
}

// READ: comprueba si una iniciativa ya tiene un proyecto.
async function buscarPorIniciativa(iniciativaId) {

    return await obtenerColeccion().findOne({
        iniciativaId
    });
}

// READ: consulta los proyectos donde participa un usuario.
async function listarProyectos(usuarioId) {

    return await obtenerColeccion()
        .find({
            miembros: usuarioId
        })
        .sort({
            fechaCreacion: -1
        })
        .toArray();
}

// Evita que una misma iniciativa tenga dos proyectos.
async function crearIndiceProyectos() {

    await obtenerColeccion().createIndex(
        { iniciativaId: 1 },
        { unique: true }
    );
}

// Exporta las funciones utilizadas por el servicio.
module.exports = {
    crearProyecto,
    buscarPorId,
    buscarPorIniciativa,
    listarProyectos,
    crearIndiceProyectos
};