const { obtenerBaseDatos } = require("../database/conexion");

// Obtiene la colección de usuarios.
function obtenerColeccion() {
    const baseDatos = obtenerBaseDatos();
    return baseDatos.collection("usuarios");
}

// Busca un usuario mediante su correo.
async function buscarPorCorreo(correo) {
    return await obtenerColeccion().findOne({ correo });
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
    crearUsuario,
    crearIndiceUsuarios
};