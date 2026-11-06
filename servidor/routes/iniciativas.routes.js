const express = require("express");

// Importamos las funciones del controlador de iniciativas.
const iniciativasController = require("../controllers/iniciativas.controller");

// Importamos el middleware que comprueba si el usuario inició sesión.
const verificarToken = require("../middleware/verificarToken");

// Creamos un grupo de rutas para las iniciativas.
const router = express.Router();


// Aplica verificarToken a todas las rutas que aparecen debajo.
// Si el usuario no tiene un token válido, no puede continuar.
router.use(verificarToken);

// READ: consulta el catálogo de iniciativas.
router.get("/", iniciativasController.listar);

// READ: consulta una iniciativa utilizando su ID.
// :id representa el identificador recibido en la URL.
router.get("/:id", iniciativasController.consultar);

// CREATE: publica una iniciativa nueva.
router.post("/", iniciativasController.crear);

// UPDATE: modifica una iniciativa existente.
router.put("/:id", iniciativasController.actualizar);

// DELETE: elimina o archiva una iniciativa.
router.delete("/:id", iniciativasController.eliminar);


// Exportamos las rutas para utilizarlas desde server.js.
module.exports = router;