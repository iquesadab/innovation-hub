const express = require("express");

// Importamos las funciones del controlador de solicitudes.
const solicitudesController = require("../controllers/solicitudes.controller");

// Importamos el middleware que comprueba si el usuario inició sesión.
const verificarToken = require("../middleware/verificarToken");

// Creamos un grupo de rutas para las solicitudes.
const router = express.Router();


// Todas las rutas requieren un token válido.
router.use(verificarToken);


// CREATE: permite solicitar participación en una iniciativa.
// :iniciativaId representa el ID de la iniciativa.
router.post(
    "/iniciativas/:iniciativaId",
    solicitudesController.crear
);


// READ: consulta las solicitudes realizadas por el usuario.
router.get(
    "/mis-solicitudes",
    solicitudesController.listarMisSolicitudes
);


// READ: consulta las solicitudes recibidas por una iniciativa.
// El propietario también puede filtrarlas por estado.
router.get(
    "/iniciativas/:iniciativaId",
    solicitudesController.listarPorIniciativa
);


// UPDATE: modifica los datos de una solicitud pendiente.
router.put(
    "/:id",
    solicitudesController.actualizar
);


// UPDATE: cancela una solicitud pendiente.
router.patch(
    "/:id/cancelar",
    solicitudesController.cancelar
);


// UPDATE: permite al propietario aceptar o rechazar una solicitud.
router.patch(
    "/:id/revisar",
    solicitudesController.revisar
);


// Exportamos las rutas para utilizarlas desde server.js.
module.exports = router;