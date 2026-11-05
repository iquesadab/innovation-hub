const express = require("express");

// Importa las funciones del controlador de usuarios.
const usuariosController = require("../controllers/usuarios.controller");

// Importa la función que revisa el token.
const verificarToken = require("../middleware/verificarToken");

// Crea las rutas relacionadas con los usuarios.
const router = express.Router();

// Registra un usuario nuevo.
router.post("/register", usuariosController.registrar);

// Ruta para iniciar sesión con correo y contraseña.
router.post("/login", usuariosController.login);

// Permite consultar el perfil solamente si inició sesión.
router.get("/me", verificarToken, usuariosController.consultarPerfil);

// Permite editar el perfil del usuario que inició sesión.
router.patch("/me", verificarToken, usuariosController.actualizarPerfil);

// Busca usuarios. Requiere haber iniciado sesión.
router.get("/usuarios", verificarToken, usuariosController.listarUsuarios);

// Permite utilizar estas rutas desde server.js.
module.exports = router;