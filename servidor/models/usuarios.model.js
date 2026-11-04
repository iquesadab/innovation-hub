const { ObjectId } = require("mongodb");
const { obtenerBaseDatos } = require("../database/conexion");

// Obtiene la colección de usuarios de MongoDB.
function obtenerColeccion() {
    return obtenerBaseDatos().collection("usuarios");
}

// Busca un usuario mediante su correo.
async function buscarPorCorreo(correo) {
    return await obtenerColeccion().findOne({ correo });
}

// Busca un usuario por su identificador.
async function buscarPorId(id) {
    return await obtenerColeccion().findOne({
        _id: new ObjectId(id)
    });
}

// Guarda un nuevo usuario.
async function crearUsuario(usuario) {
    const resultado = await obtenerColeccion().insertOne(usuario);
    return resultado.insertedId;
}

// Crea un índice para evitar correos repetidos.
async function crearIndiceUsuarios() {
    await obtenerColeccion().createIndex(
        { correo: 1 },
        { unique: true }
    );
}

module.exports = {
    buscarPorCorreo,
    buscarPorId,
    crearUsuario,
    crearIndiceUsuarios
};