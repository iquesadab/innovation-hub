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

// Permite recibir datos en formato JSON.
app.use(express.json());

// Permite solicitudes desde la aplicación React.
app.use(cors({
    origin: process.env.CLIENT_URL
}));

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

    console.error("Error interno del servidor:", error.message);

    res.status(500).json({
        error: {
            codigo: "ERROR_INTERNO",
            mensaje: "Ocurrió un error en el servidor."
        }
    });

});

// Inicia el servidor después de conectarse a MongoDB.
async function iniciarServidor() {

    try {

        await conectarBaseDatos();

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