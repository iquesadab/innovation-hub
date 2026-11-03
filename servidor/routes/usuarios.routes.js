const express = require("express");

const usuariosController = require("../controllers/usuarios.controller");

const router = express.Router();

// Registra un usuario nuevo.
router.post("/register", usuariosController.registrar);

module.exports = router;