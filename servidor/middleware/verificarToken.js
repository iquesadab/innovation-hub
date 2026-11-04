const jwt = require("jsonwebtoken");

// Revisa si el usuario envió un token válido.
function verificarToken(req, res, next) {

    // Obtiene el token enviado en los encabezados.
    const autorizacion = req.headers.authorization;

    // Comprueba que se haya enviado correctamente.
    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        return res.status(401).json({
            error: {
                codigo: "NO_AUTORIZADO",
                mensaje: "Debe iniciar sesión."
            }
        });
    }

    // Separa la palabra Bearer del token.
    const token = autorizacion.split(" ")[1];

    try {
        // Comprueba que el token sea válido y no haya vencido.
        const datos = jwt.verify(token, process.env.JWT_SECRET);

        // Guarda el identificador del usuario para las siguientes funciones.
        req.usuarioId = datos.id;

        // Permite continuar con la petición.
        next();

    } catch (error) {
        // Si el token es incorrecto o venció, rechaza la petición.
        return res.status(401).json({
            error: {
                codigo: "TOKEN_INVALIDO",
                mensaje: "Debe iniciar sesión nuevamente."
            }
        });
    }
}

module.exports = verificarToken;