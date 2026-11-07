const express = require("express");

const proyectosController = require("../controllers/proyectos.controller");

// Importa el middleware que verifica el token JWT.
const verificarToken = require("../middleware/verificarToken");

const router = express.Router();

// Todas las rutas requieren un usuario autenticado.
router.use(verificarToken);

// CREATE: convierte una iniciativa en proyecto.
// El ID corresponde a la iniciativa original.
router.post(
    "/desde-iniciativa/:iniciativaId",
    proyectosController.convertir
);

// READ: consulta los proyectos del usuario autenticado.
router.get(
    "/",
    proyectosController.listar
);

// READ: consulta el detalle de un proyecto por su ID.
router.get(
    "/:id",
    proyectosController.consultar
);

// Exporta las rutas para utilizarlas en server.js.
module.exports = router;