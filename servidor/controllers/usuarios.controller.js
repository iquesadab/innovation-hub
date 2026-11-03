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

// Recibe los datos enviados para iniciar sesión.
async function login(req, res, next) {
    try {
        // Envía los datos al servicio para revisar el correo y la contraseña.
        const resultado = await usuariosService.iniciarSesion(req.body);

        // Si los datos son correctos, devuelve el token y el usuario.
        res.status(200).json({
            mensaje: "Inicio de sesión correcto.",
            token: resultado.token,
            usuario: resultado.usuario
        });

    } catch (error) {
        // Envía el error al manejador de errores del servidor.
        next(error);
    }
}

module.exports = {
    registrar,
    login
};