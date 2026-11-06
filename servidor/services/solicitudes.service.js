const solicitudesModel = require("../models/solicitudes.model");
const iniciativasModel = require("../models/iniciativas.model");

// Obtiene el cliente de MongoDB para manejar transacciones.
const { obtenerCliente } = require("../database/conexion");

// Crea errores con un estado HTTP, código y mensaje.
function crearError(estado, codigo, mensaje) {
    const error = new Error(mensaje);
    error.estado = estado;
    error.codigo = codigo;
    return error;
}


// Comprueba que el ID tenga el formato correcto de MongoDB.
function validarId(id) {
    if (typeof id !== "string" || !/^[a-fA-F0-9]{24}$/.test(id)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El identificador no es válido."
        );
    }
}


// Valida la información enviada en una solicitud.
function validarDatos(datos) {

    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Debe enviar los datos de la solicitud."
        );
    }

    const camposPermitidos = [
        "motivo",
        "experiencia",
        "disponibilidad",
        "competencias"
    ];

    // Object.keys() obtiene los campos enviados.
    // some() comprueba si alguno no está permitido.
    if (Object.keys(datos).some(campo =>
        !camposPermitidos.includes(campo))) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La solicitud contiene campos no permitidos."
        );
    }

    const limites = {
        motivo: [10, 1000],
        experiencia: [0, 1000],
        disponibilidad: [3, 200]
    };

    const resultado = {};

    // Object.entries() permite recorrer cada campo junto con sus límites.
    for (const [campo, [minimo, maximo]] of Object.entries(limites)) {

        const valor = datos[campo];

        // La experiencia es opcional.
        if (campo === "experiencia" && valor === undefined) {
            resultado[campo] = "";
            continue;
        }

        if (typeof valor !== "string") {
            throw crearError(
                400,
                "DATOS_INVALIDOS",
                `El campo ${campo} debe ser texto.`
            );
        }

        const texto = valor.trim();

        if (texto.length < minimo || texto.length > maximo) {
            throw crearError(
                400,
                "DATOS_INVALIDOS",
                `Revise la longitud del campo ${campo}.`
            );
        }

        resultado[campo] = texto;
    }

    // Si no se enviaron competencias, utilizamos una lista vacía.
    const competencias = datos.competencias === undefined
        ? []
        : datos.competencias;

    // Comprueba que las competencias sean una lista de textos.
    if (!Array.isArray(competencias) ||
        competencias.length > 20 ||
        competencias.some(valor =>
            typeof valor !== "string" ||
            valor.trim().length < 2 ||
            valor.trim().length > 50)) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Las competencias no son válidas."
        );
    }

    // map() elimina los espacios innecesarios.
    resultado.competencias = competencias.map(valor => valor.trim());

    // Set permite detectar competencias repetidas.
    const unicos = new Set(
        resultado.competencias.map(valor => valor.toLowerCase())
    );

    if (unicos.size !== resultado.competencias.length) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "No puede repetir competencias."
        );
    }

    return resultado;
}


// Prepara la solicitud para devolverla en la respuesta de la API.
function prepararSolicitud(solicitud) {
    return {
        id: solicitud._id.toString(),
        iniciativaId: solicitud.iniciativaId,
        usuarioId: solicitud.usuarioId,
        motivo: solicitud.motivo,
        experiencia: solicitud.experiencia,
        disponibilidad: solicitud.disponibilidad,
        competencias: solicitud.competencias,
        estado: solicitud.estado,
        fechaCreacion: solicitud.fechaCreacion,
        fechaModificacion: solicitud.fechaModificacion
    };
}


// Comprueba que la iniciativa exista y esté disponible.
async function obtenerIniciativaDisponible(iniciativaId) {

    validarId(iniciativaId);

    const iniciativa = await iniciativasModel.buscarPorId(iniciativaId);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // No se pueden enviar solicitudes a iniciativas archivadas.
    if (iniciativa.estado !== "abierta") {
        throw crearError(
            409,
            "INICIATIVA_NO_DISPONIBLE",
            "La iniciativa no está disponible para recibir solicitudes."
        );
    }

    return iniciativa;
}


// CREATE: registra una solicitud de participación.
async function crearSolicitud(iniciativaId, datos, usuarioId) {

    const iniciativa = await obtenerIniciativaDisponible(iniciativaId);

    // El propietario no necesita solicitar participar en su iniciativa.
    if (iniciativa.propietarioId === usuarioId) {
        throw crearError(
            409,
            "SOLICITUD_NO_PERMITIDA",
            "No puede solicitar participar en su propia iniciativa."
        );
    }

    // No permitimos solicitar participación si ya es miembro.
    if ((iniciativa.miembros || []).includes(usuarioId)) {
        throw crearError(
            409,
            "USUARIO_YA_ES_MIEMBRO",
            "Ya forma parte de esta iniciativa."
        );
    }

    // Por ahora, las iniciativas privadas e institucionales
    // no aceptan solicitudes de usuarios externos.
    if (["privada", "institucional"].includes(iniciativa.visibilidad)) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "No puede solicitar participación en esta iniciativa."
        );
    }

    const pendiente = await solicitudesModel.buscarPendiente(
        iniciativaId,
        usuarioId
    );

    if (pendiente) {
        throw crearError(
            409,
            "SOLICITUD_DUPLICADA",
            "Ya tiene una solicitud pendiente para esta iniciativa."
        );
    }

    const informacion = validarDatos(datos);
    const fecha = new Date();

    const nuevaSolicitud = {
        iniciativaId,
        usuarioId,
        ...informacion,
        estado: "pendiente",
        fechaCreacion: fecha,
        fechaModificacion: fecha
    };

    // Guarda la solicitud y consulta el documento creado.
    try {
        const id = await solicitudesModel.crearSolicitud(nuevaSolicitud);
        const solicitud = await solicitudesModel.buscarPorId(id);

        return prepararSolicitud(solicitud);

    } catch (error) {

        // MongoDB utiliza el código 11000 cuando un índice
        // único impide guardar un documento duplicado.
        if (error.code === 11000) {
            throw crearError(
                409,
                "SOLICITUD_DUPLICADA",
                "Ya tiene una solicitud pendiente para esta iniciativa."
            );
        }

        throw error;
    }
}


// READ: consulta las solicitudes realizadas por un usuario.
async function consultarMisSolicitudes(usuarioId) {

    const solicitudes = await solicitudesModel.buscarPorUsuario(usuarioId);

    // map() transforma cada documento en la respuesta de la API.
    return solicitudes.map(solicitud => prepararSolicitud(solicitud));
}


// READ: consulta las solicitudes recibidas por una iniciativa.
async function consultarSolicitudesIniciativa(iniciativaId, usuarioId, estado = "") {

    validarId(iniciativaId);

    const iniciativa = await iniciativasModel.buscarPorId(iniciativaId);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Solamente el propietario puede revisar las solicitudes recibidas.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede consultar estas solicitudes."
        );
    }

    const estadosPermitidos = [
        "pendiente",
        "aceptada",
        "rechazada",
        "cancelada"
    ];

    if (estado && !estadosPermitidos.includes(estado)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El estado de la solicitud no es válido."
        );
    }

    const solicitudes = await solicitudesModel.buscarPorIniciativa(
        iniciativaId,
        estado
    );

    return solicitudes.map(solicitud => prepararSolicitud(solicitud));
}


// UPDATE: modifica una solicitud mientras esté pendiente.
async function editarSolicitud(id, datos, usuarioId) {

    validarId(id);

    const solicitud = await solicitudesModel.buscarPorId(id);

    if (!solicitud) {
        throw crearError(
            404,
            "SOLICITUD_NO_ENCONTRADA",
            "No se encontró la solicitud."
        );
    }

    // Solo el usuario que creó la solicitud puede editarla.
    if (solicitud.usuarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "No puede modificar una solicitud de otro usuario."
        );
    }

    if (solicitud.estado !== "pendiente") {
        throw crearError(
            409,
            "SOLICITUD_NO_EDITABLE",
            "Solo puede modificar solicitudes pendientes."
        );
    }

    const cambios = validarDatos(datos);
    cambios.fechaModificacion = new Date();

    // Incluimos el estado en el filtro para evitar modificar
    // una solicitud que ya fue aceptada o rechazada.
    const actualizado = await solicitudesModel.actualizarSolicitud(
        id,
        {
            usuarioId,
            estado: "pendiente"
        },
        cambios
    );

    if (actualizado === 0) {
        throw crearError(
            409,
            "SOLICITUD_NO_EDITABLE",
            "La solicitud ya no está pendiente."
        );
    }

    const solicitudActualizada = await solicitudesModel.buscarPorId(id);

    return prepararSolicitud(solicitudActualizada);
}


// UPDATE: cancela una solicitud pendiente.
async function cancelarSolicitud(id, usuarioId) {

    validarId(id);

    const solicitud = await solicitudesModel.buscarPorId(id);

    if (!solicitud) {
        throw crearError(
            404,
            "SOLICITUD_NO_ENCONTRADA",
            "No se encontró la solicitud."
        );
    }

    if (solicitud.usuarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "No puede cancelar una solicitud de otro usuario."
        );
    }

    if (solicitud.estado !== "pendiente") {
        throw crearError(
            409,
            "SOLICITUD_NO_CANCELABLE",
            "Solo puede cancelar solicitudes pendientes."
        );
    }

    const actualizado = await solicitudesModel.actualizarSolicitud(
        id,
        {
            usuarioId,
            estado: "pendiente"
        },
        {
            estado: "cancelada",
            fechaModificacion: new Date()
        }
    );

    if (actualizado === 0) {
        throw crearError(
            409,
            "SOLICITUD_NO_CANCELABLE",
            "La solicitud ya no está pendiente."
        );
    }

    return "cancelada";
}


// UPDATE: el propietario acepta o rechaza una solicitud.
async function revisarSolicitud(id, decision, usuarioId) {

    validarId(id);

    if (!["aceptada", "rechazada"].includes(decision)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La decisión debe ser aceptada o rechazada."
        );
    }

    const solicitud = await solicitudesModel.buscarPorId(id);

    if (!solicitud) {
        throw crearError(
            404,
            "SOLICITUD_NO_ENCONTRADA",
            "No se encontró la solicitud."
        );
    }

    const iniciativa = await iniciativasModel.buscarPorId(
        solicitud.iniciativaId
    );

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Solamente el propietario puede revisar las solicitudes.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede revisar las solicitudes."
        );
    }

    if (solicitud.estado !== "pendiente") {
        throw crearError(
            409,
            "SOLICITUD_YA_REVISADA",
            "La solicitud ya fue revisada o cancelada."
        );
    }

    if (iniciativa.estado !== "abierta") {
        throw crearError(
            409,
            "INICIATIVA_NO_DISPONIBLE",
            "La iniciativa no está disponible."
        );
    }

    if (decision === "aceptada" &&
        (iniciativa.miembros || []).includes(solicitud.usuarioId)) {

        throw crearError(
            409,
            "USUARIO_YA_ES_MIEMBRO",
            "El usuario ya forma parte de la iniciativa."
        );
    }

    // startSession() crea una sesión para trabajar con transacciones.
    const sesion = obtenerCliente().startSession();

    try {

        // withTransaction() ejecuta las operaciones como una unidad.
        // Si ocurre un error, MongoDB deshace los cambios de la transacción.
        await sesion.withTransaction(async () => {

            const actualizado = await solicitudesModel.actualizarSolicitud(
                id,
                {
                    estado: "pendiente"
                },
                {
                    estado: decision,
                    fechaModificacion: new Date()
                },
                sesion
            );

            // Si la solicitud dejó de estar pendiente,
            // no permitimos continuar con la operación.
            if (actualizado === 0) {
                throw crearError(
                    409,
                    "SOLICITUD_YA_REVISADA",
                    "La solicitud ya no está pendiente."
                );
            }

            // Solo agregamos un integrante cuando la decisión es aceptada.
            if (decision === "aceptada") {

                const agregado = await solicitudesModel.agregarMiembro(
                    solicitud.iniciativaId,
                    usuarioId,
                    solicitud.usuarioId,
                    sesion
                );

                if (agregado === 0) {
                    throw crearError(
                        409,
                        "INICIATIVA_NO_DISPONIBLE",
                        "No se pudo agregar el integrante a la iniciativa."
                    );
                }
            }
        });

    } finally {

        // endSession() cierra la sesión al finalizar,
        // tanto si la operación fue correcta como si ocurrió un error.
        await sesion.endSession();
    }

    const solicitudActualizada = await solicitudesModel.buscarPorId(id);

    return prepararSolicitud(solicitudActualizada);
}


// Exportamos las funciones para utilizarlas desde solicitudes.controller.js.
module.exports = {
    crearSolicitud,
    consultarMisSolicitudes,
    consultarSolicitudesIniciativa,
    editarSolicitud,
    cancelarSolicitud,
    revisarSolicitud
}