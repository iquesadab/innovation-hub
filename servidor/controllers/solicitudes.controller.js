const solicitudesService = require("../services/solicitudes.service");


// CREATE: recibe una solicitud para participar en una iniciativa.
async function crear(req, res, next) {
    try {

        // req.params.iniciativaId obtiene el ID de la iniciativa desde la URL.
        // req.body contiene los datos enviados por el usuario.
        // req.usuarioId contiene el ID del usuario que inició sesión.
        const solicitud = await solicitudesService.crearSolicitud(
            req.params.iniciativaId,
            req.body,
            req.usuarioId
        );

        // 201 indica que la solicitud se creó correctamente.
        res.status(201).json({
            mensaje: "Solicitud enviada correctamente.",
            solicitud
        });

    } catch (error) {
        // next(error) envía el error al manejador de Express.
        next(error);
    }
}


// READ: consulta las solicitudes realizadas por el usuario.
async function listarMisSolicitudes(req, res, next) {
    try {

        const solicitudes = await solicitudesService.consultarMisSolicitudes(
            req.usuarioId
        );

        res.status(200).json({
            solicitudes
        });

    } catch (error) {
        next(error);
    }
}


// READ: consulta las solicitudes recibidas por una iniciativa.
async function listarPorIniciativa(req, res, next) {
    try {

        // req.query.estado permite filtrar las solicitudes.
        // Ejemplo: ?estado=pendiente
        const solicitudes = await solicitudesService.consultarSolicitudesIniciativa(
            req.params.iniciativaId,
            req.usuarioId,
            req.query.estado || ""
        );

        res.status(200).json({
            solicitudes
        });

    } catch (error) {
        next(error);
    }
}


// UPDATE: modifica una solicitud que todavía está pendiente.
async function actualizar(req, res, next) {
    try {

        const solicitud = await solicitudesService.editarSolicitud(
            req.params.id,
            req.body,
            req.usuarioId
        );

        res.status(200).json({
            mensaje: "Solicitud actualizada correctamente.",
            solicitud
        });

    } catch (error) {
        next(error);
    }
}


// UPDATE: cancela una solicitud pendiente.
async function cancelar(req, res, next) {
    try {

        await solicitudesService.cancelarSolicitud(
            req.params.id,
            req.usuarioId
        );

        res.status(200).json({
            mensaje: "Solicitud cancelada correctamente."
        });

    } catch (error) {
        next(error);
    }
}


// UPDATE: el propietario acepta o rechaza una solicitud.
async function revisar(req, res, next) {
    try {

        // req.body.decision debe contener "aceptada" o "rechazada".
        const solicitud = await solicitudesService.revisarSolicitud(
            req.params.id,
            req.body.decision,
            req.usuarioId
        );

        res.status(200).json({
            mensaje: "Solicitud revisada correctamente.",
            solicitud
        });

    } catch (error) {
        next(error);
    }
}


// Exportamos las funciones para utilizarlas en solicitudes.routes.js.
module.exports = {
    crear,
    listarMisSolicitudes,
    listarPorIniciativa,
    actualizar,
    cancelar,
    revisar
};