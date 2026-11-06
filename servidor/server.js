// Carga las variables del archivo .env.
require("dotenv").config();

// Importa Express y CORS.
const express = require("express");
const cors = require("cors");

// Importa la conexión con MongoDB.
const { conectarBaseDatos } = require("./database/conexion");

// Crea la aplicación.
const app = express();

// Obtiene el puerto configurado.
const puerto = Number(process.env.PORT) || 3001;

const usuariosRoutes = require("./routes/usuarios.routes");

const { crearIndiceUsuarios } = require("./models/usuarios.model");

// Importamos las rutas de iniciativas.
const iniciativasRoutes = require("./routes/iniciativas.routes");

// Permite recibir datos en formato JSON.
app.use(express.json());

// Permite solicitudes desde la aplicación React.
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Rutas de autenticación.
app.use("/api/auth", usuariosRoutes);

// Todas las rutas de iniciativas comenzarán con /api/initiatives.
app.use("/api/initiatives", iniciativasRoutes);

// Ruta para comprobar que el servidor funciona.
app.get("/api/prueba", function (req, res) {

    res.status(200).json({
        mensaje: "El servidor funciona correctamente"
    });

});

// Respuesta para rutas que no existen.
app.use(function (req, res) {

    res.status(404).json({
        error: {
            codigo: "RUTA_NO_ENCONTRADA",
            mensaje: "La ruta solicitada no existe."
        }
    });

});

// Maneja errores inesperados sin mostrar información interna.
app.use(function (error, req, res, next) {

    // Los errores conocidos conservan su código HTTP.
    const estado = error.estado || 500;

    if (estado === 500) {
        console.error("Error interno:", error);
    }

    res.status(estado).json({
        error: {
            codigo: error.codigo || "ERROR_INTERNO",
            mensaje: estado === 500
                ? "Ocurrió un error en el servidor."
                : error.message
        }
    });
});

// Inicia el servidor después de conectarse a MongoDB.
async function iniciarServidor() {

    try {

        await conectarBaseDatos();
        
        // Prepara el índice único del correo.
        await crearIndiceUsuarios();

        app.listen(puerto, function () {

            console.log(
                `Servidor disponible en http://localhost:${puerto}`
            );

        });

    } catch (error) {

        console.error(
            "No se pudo iniciar el servidor:",
            error.message
        );

        process.exitCode = 1;
    }
}

// Ejecuta la función principal.
iniciarServidor();