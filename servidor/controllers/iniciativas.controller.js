const iniciativasService = require("../services/iniciativas.service");


// CREATE: recibe la petición para publicar una iniciativa.
async function crear(req, res, next) {
    try {
        // req.body contiene los datos enviados por el usuario.
        // req.usuarioId contiene el ID obtenido del token.
        const iniciativa = await iniciativasService.crearIniciativa(
            req.body,
            req.usuarioId
        );

        // 201 indica que la iniciativa se creó correctamente.
        res.status(201).json({
            mensaje: "Iniciativa creada correctamente.",
            iniciativa
        });

    } catch (error) {
        // next(error) envía el error al manejador de Express.
        next(error);
    }
}


// READ: devuelve el catálogo de iniciativas.
async function listar(req, res, next) {
    try {
        // req.query contiene los filtros enviados en la URL.
        // Ejemplo: ?type=idea&page=1&size=10
        const resultado = await iniciativasService.consultarIniciativas(
            req.query,
            req.usuarioId
        );

        res.status(200).json(resultado);

    } catch (error) {
        next(error);
    }
}


// READ: consulta los detalles de una iniciativa.
async function consultar(req, res, next) {
    try {
        // req.params.id obtiene el identificador de la URL.
        // Ejemplo: /api/initiatives/6729a1b2c3d4e5f607182930
        const iniciativa = await iniciativasService.consultarDetalle(
            req.params.id,
            req.usuarioId
        );

        res.status(200).json({
            iniciativa
        });

    } catch (error) {
        next(error);
    }
}


// UPDATE: recibe los cambios para modificar una iniciativa.
async function actualizar(req, res, next) {
    try {
        // Enviamos el ID de la iniciativa, los cambios
        // y el ID del usuario que inició sesión.
        const iniciativa = await iniciativasService.editarIniciativa(
            req.params.id,
            req.body,
            req.usuarioId
        );

        res.status(200).json({
            mensaje: "Iniciativa actualizada correctamente.",
            iniciativa
        });

    } catch (error) {
        next(error);
    }
}


// DELETE: solicita eliminar o archivar una iniciativa.
async function eliminar(req, res, next) {
    try {
        // El servicio decide si debe eliminarla o archivarla.
        const resultado = await iniciativasService.eliminarIniciativa(
            req.params.id,
            req.usuarioId
        );

        // Si tiene información relacionada, se archiva.
        if (resultado === "archivada") {
            return res.status(200).json({
                mensaje: "La iniciativa fue archivada."
            });
        }

        // 204 indica que se eliminó correctamente.
        // No enviamos JSON porque este estado no lleva contenido.
        res.status(204).send();

    } catch (error) {
        next(error);
    }
}


 // READ: consulta los integrantes de una iniciativa.
async function listarMiembros(req, res, next) {
    try {
        // Envía el ID de la iniciativa y el usuario autenticado.
        const miembros = await iniciativasService.consultarMiembros(
            req.params.id,
            req.usuarioId
        );

        res.status(200).json({
            miembros
        });

    } catch (error) {
        next(error);
    }
}


 // DELETE: permite al propietario eliminar un integrante del equipo.
async function eliminarMiembro(req, res, next) {
    try {
        // Obtiene el ID de la iniciativa y del integrante desde la URL.
        const miembros = await iniciativasService.quitarMiembro(
            req.params.id,
            req.params.miembroId,
            req.usuarioId
        );

        res.status(200).json({
            mensaje: "Integrante eliminado correctamente.",
            miembros
        });

    } catch (error) {
        next(error);
    }
}



// Exportamos las funciones para utilizarlas en las rutas.
module.exports = {
    crear,
    listar,
    consultar,
    actualizar,
    eliminar,
    listarMiembros,
    eliminarMiembro
};
