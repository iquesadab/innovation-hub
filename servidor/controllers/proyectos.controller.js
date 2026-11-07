const proyectosService = require("../services/proyectos.service");

// CREATE: convierte una iniciativa en proyecto.
async function convertir(req, res, next) {

    try {
        // Obtiene el ID de la iniciativa desde la URL.
        const iniciativaId = req.params.iniciativaId;

        // Obtiene los datos del proyecto enviados en el body.
        const datos = req.body;

        // req.usuarioId contiene el usuario autenticado con JWT.
        const proyecto = await proyectosService.convertirEnProyecto(
            iniciativaId,
            datos,
            req.usuarioId
        );

        // Devuelve el proyecto creado con el código 201.
        res.status(201).json({
            mensaje: "Iniciativa convertida en proyecto correctamente.",
            proyecto
        });

    } catch (error) {
        // Envía el error al middleware que lo maneja.
        next(error);
    }
}

// READ: consulta los proyectos del usuario autenticado.
async function listar(req, res, next) {

    try {
        const proyectos = await proyectosService.consultarProyectos(
            req.usuarioId
        );

        // Devuelve la lista de proyectos.
        res.status(200).json({
            proyectos
        });

    } catch (error) {
        next(error);
    }
}

// READ: consulta el detalle de un proyecto.
async function consultar(req, res, next) {

    try {
        // Obtiene el ID del proyecto desde la URL.
        const id = req.params.id;

        const proyecto = await proyectosService.consultarDetalle(
            id,
            req.usuarioId
        );

        // Devuelve la información del proyecto encontrado.
        res.status(200).json({
            proyecto
        });

    } catch (error) {
        next(error);
    }
}

// Exporta las funciones que utilizará proyectos.routes.js.
module.exports = {
    convertir,
    listar,
    consultar
};