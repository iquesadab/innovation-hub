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

// Recibe la petición para consultar el perfil.
async function consultarPerfil(req, res, next) {
    try {
        // Obtiene el perfil del usuario que inició sesión.
        const usuario = await usuariosService.obtenerPerfil(req.usuarioId);

        // Devuelve los datos del perfil.
        res.status(200).json({
            usuario
        });

    } catch (error) {
        // Envía los errores al manejador de Express.
        next(error);
    }
}

// Recibe la petición para editar el perfil.
async function actualizarPerfil(req, res, next) {
    try {
        const usuario = await usuariosService.editarPerfil(
            req.usuarioId,
            req.body
        );

        res.status(200).json({
            mensaje: "Perfil actualizado correctamente.",
            usuario
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    registrar,
    login,
    consultarPerfil,
    actualizarPerfil
};