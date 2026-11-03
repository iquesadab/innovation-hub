const bcrypt = require("bcryptjs");

const usuariosModel = require("../models/usuarios.model");

// Permite generar tokens para identificar a los usuarios.
const jwt = require("jsonwebtoken");

// Crea un error con un código HTTP.
function crearError(estado, codigo, mensaje) {
    const error = new Error(mensaje);
    error.estado = estado;
    error.codigo = codigo;
    return error;
}

// Valida y registra un nuevo usuario.
async function registrarUsuario(datos) {

    const {
        nombre,
        correo,
        contrasena,
        carrera,
        competencias,
        disponibilidad
    } = datos || {};

    // Comprueba los campos obligatorios.
    if (
        typeof nombre !== "string" ||
        typeof correo !== "string" ||
        typeof contrasena !== "string" ||
        typeof carrera !== "string" ||
        typeof disponibilidad !== "string" ||
        !Array.isArray(competencias)
    ) {
        throw crearError(400, "DATOS_INVALIDOS",
            "Debe completar correctamente todos los campos.");
    }

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const carreraLimpia = carrera.trim();
    const disponibilidadLimpia = disponibilidad.trim();

    if (
        nombreLimpio.length < 3 ||
        nombreLimpio.length > 100 ||
        carreraLimpia.length < 2 ||
        carreraLimpia.length > 100 ||
        disponibilidadLimpia.length < 2 ||
        disponibilidadLimpia.length > 100
    ) {
        throw crearError(400, "DATOS_INVALIDOS",
            "Revise la longitud de los campos.");
    }

    // Comprueba el formato básico del correo.
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        correoLimpio.length > 254 ||
        !formatoCorreo.test(correoLimpio)
    ) {
        throw crearError(400, "DATOS_INVALIDOS",
            "El correo electrónico no es válido.");
    }

    if (contrasena.length < 8 || contrasena.length > 72) {
        throw crearError(400, "DATOS_INVALIDOS",
            "La contraseña debe tener entre 8 y 72 caracteres.");
    }

    // Comprueba que las competencias sean textos válidos.
    if (
        competencias.length > 20 ||
        competencias.some(competencia =>
            typeof competencia !== "string" ||
            competencia.trim().length < 2 ||
            competencia.trim().length > 50
        )
    ) {
        throw crearError(400, "DATOS_INVALIDOS",
            "Revise las competencias ingresadas.");
    }

    const competenciasLimpias = competencias.map(
        competencia => competencia.trim()
    );

    // No permite competencias repetidas.
    const competenciasUnicas = new Set(
        competenciasLimpias.map(competencia =>
            competencia.toLowerCase()
        )
    );

    if (competenciasUnicas.size !== competenciasLimpias.length) {
        throw crearError(400, "DATOS_INVALIDOS",
            "No puede repetir competencias.");
    }

    // Comprueba que el correo todavía no exista.
    const usuarioExistente = await usuariosModel.buscarPorCorreo(
        correoLimpio
    );

    if (usuarioExistente) {
        throw crearError(409, "CORREO_DUPLICADO",
            "Ya existe un usuario con ese correo.");
    }

    // Protege la contraseña antes de guardarla.
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = {
        nombre: nombreLimpio,
        correo: correoLimpio,
        contrasenaHash,
        carrera: carreraLimpia,
        competencias: competenciasLimpias,
        disponibilidad: disponibilidadLimpia,
        fechaCreacion: new Date()
    };

    try {
        const id = await usuariosModel.crearUsuario(nuevoUsuario);

        // Devuelve los datos públicos, nunca el hash.
        return {
            id: id.toString(),
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            carrera: nuevoUsuario.carrera,
            competencias: nuevoUsuario.competencias,
            disponibilidad: nuevoUsuario.disponibilidad
        };

    } catch (error) {

        // MongoDB utiliza 11000 para conflictos de índice único.
        if (error.code === 11000) {
            throw crearError(409, "CORREO_DUPLICADO",
                "Ya existe un usuario con ese correo.");
        }

        throw error;
    }
}

// Comprueba los datos del usuario y permite iniciar sesión.
async function iniciarSesion(datos) {

    // Recibe el correo y la contraseña enviados por el usuario.
    const { correo, contrasena } = datos || {};

    // Comprueba que ambos campos sean textos.
    if (typeof correo !== "string" || typeof contrasena !== "string") {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Debe ingresar el correo y la contraseña."
        );
    }

    // Elimina espacios y convierte el correo a minúsculas.
    const correoLimpio = correo.trim().toLowerCase();

    // Comprueba que los campos no estén vacíos.
    if (!correoLimpio || !contrasena) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Debe ingresar el correo y la contraseña."
        );
    }

    // Busca al usuario en MongoDB por su correo.
    const usuario = await usuariosModel.buscarPorCorreo(correoLimpio);

    // Si el usuario no existe, muestra un error.
    if (!usuario) {
        throw crearError(
            401,
            "CREDENCIALES_INVALIDAS",
            "Correo o contraseña incorrectos."
        );
    }

    // Compara la contraseña ingresada con el hash guardado.
    const contrasenaCorrecta = await bcrypt.compare(
        contrasena,
        usuario.contrasenaHash
    );

    // Si la contraseña es incorrecta, no permite ingresar.
    if (!contrasenaCorrecta) {
        throw crearError(
            401,
            "CREDENCIALES_INVALIDAS",
            "Correo o contraseña incorrectos."
        );
    }

    // Comprueba que exista la clave secreta para generar el token.
    if (!process.env.JWT_SECRET) {
        throw new Error("Falta configurar JWT_SECRET.");
    }

    // Genera un token que identifica al usuario.
    const token = jwt.sign(
        { id: usuario._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    // Devuelve el token y los datos públicos del usuario.
    return {
        token,
        usuario: {
            id: usuario._id.toString(),
            nombre: usuario.nombre,
            correo: usuario.correo,
            carrera: usuario.carrera,
            competencias: usuario.competencias,
            disponibilidad: usuario.disponibilidad
        }
    };
}

module.exports = {
    registrarUsuario,
    iniciarSesion
};