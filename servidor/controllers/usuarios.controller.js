const usuariosService = require("../services/usuarios.service");

// Atiende la solicitud de registro.
async function registrar(req, res, next) {

    try {
        const usuario = await usuariosService.registrarUsuario(req.body);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    registrar
};