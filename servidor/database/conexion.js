// Importa MongoClient para conectarse a MongoDB.
const { MongoClient } = require("mongodb");

// Obtiene los datos de conexión desde las variables de entorno.
const uri = process.env.MONGO_URI;
const nombreBaseDatos = process.env.DB_NAME;

// Guarda la conexión a la base de datos.
let baseDatos;

// Conecta el servidor con MongoDB Atlas.
async function conectarBaseDatos() {

    if (!uri || !nombreBaseDatos) {
        throw new Error("Faltan las variables de conexión a MongoDB.");
    }

    const clienteMongo = new MongoClient(uri);

    await clienteMongo.connect();

    baseDatos = clienteMongo.db(nombreBaseDatos);

    console.log("Conexión exitosa con MongoDB Atlas");

    return baseDatos;
}

// Devuelve la base de datos para utilizarla en otros archivos.
function obtenerBaseDatos() {

    if (!baseDatos) {
        throw new Error("La base de datos no está conectada.");
    }

    return baseDatos;
}

// Devuelve el cliente de MongoDB para poder utilizar transacciones.
function obtenerCliente() {
    return clienteMongo;
}

module.exports = {
    conectarBaseDatos,
    obtenerBaseDatos
};