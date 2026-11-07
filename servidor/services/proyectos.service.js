const { ObjectId } = require("mongodb");

const proyectosModel = require("../models/proyectos.model");
const iniciativasModel = require("../models/iniciativas.model");
const { obtenerCliente, obtenerBaseDatos } = require("../database/conexion");

// Crea errores con el mismo formato utilizado en el backend.
function crearError(estado, codigo, mensaje) {
    const error = new Error(mensaje);
    error.estado = estado;
    error.codigo = codigo;
    return error;
}

// Comprueba que el identificador tenga el formato correcto.
function validarId(id) {
    if (typeof id !== "string" || !/^[a-fA-F0-9]{24}$/.test(id)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El identificador no es válido."
        );
    }
}

// Comprueba los datos enviados para convertir la iniciativa.
function validarDatos(datos) {

    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Debe enviar los datos del proyecto."
        );
    }

    // Estos son los campos que puede enviar el usuario.
    const camposPermitidos = [
        "objetivo",
        "fechaInicio",
        "repositorioGitHub"
    ];

    // Evita recibir campos que no corresponden al proyecto.
    if (Object.keys(datos).some(campo =>
        !camposPermitidos.includes(campo))) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El proyecto contiene campos no permitidos."
        );
    }

    // El objetivo es obligatorio y debe tener entre 10 y 1000 caracteres.
    if (typeof datos.objetivo !== "string" ||
        datos.objetivo.trim().length < 10 ||
        datos.objetivo.trim().length > 1000) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El objetivo debe tener entre 10 y 1000 caracteres."
        );
    }

    // La fecha de inicio debe utilizar el formato AAAA-MM-DD.
    if (typeof datos.fechaInicio !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaInicio)) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La fecha de inicio debe tener el formato AAAA-MM-DD."
        );
    }

    // Comprueba que la fecha realmente exista.
    const fechaInicio = new Date(datos.fechaInicio + "T00:00:00.000Z");

    if (Number.isNaN(fechaInicio.getTime()) ||
        fechaInicio.toISOString().slice(0, 10) !== datos.fechaInicio) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La fecha de inicio no es válida."
        );
    }

    // El repositorio de GitHub es opcional.
    const repositorio = datos.repositorioGitHub === undefined
        ? ""
        : datos.repositorioGitHub;

    if (typeof repositorio !== "string" ||
        repositorio.length > 300) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El repositorio de GitHub no es válido."
        );
    }

    const repositorioLimpio = repositorio.trim();

    // Si se proporciona un repositorio, debe ser una URL de GitHub.
    if (repositorioLimpio) {

        let url;

        try {
            url = new URL(repositorioLimpio);
        } catch {
            throw crearError(
                400,
                "DATOS_INVALIDOS",
                "Debe proporcionar una URL válida de GitHub."
            );
        }

        // La URL debe apuntar a un repositorio: usuario/repositorio.
        const partes = url.pathname.split("/").filter(Boolean);

        if (url.protocol !== "https:" ||
            url.hostname !== "github.com" ||
            partes.length !== 2 ||
            url.username ||
            url.password ||
            url.search ||
            url.hash ||
            partes.some(parte => !/^[a-zA-Z0-9._-]+$/.test(parte))) {

            throw crearError(
                400,
                "DATOS_INVALIDOS",
                "Debe proporcionar la URL de un repositorio de GitHub."
            );
        }
    }

    // Devuelve los datos después de validarlos.
    return {
        objetivo: datos.objetivo.trim(),
        fechaInicio,
        repositorioGitHub: repositorioLimpio
    };
}

// Prepara el proyecto para devolverlo al cliente.
function prepararProyecto(proyecto) {
    return {
        ...proyecto,
        id: proyecto._id.toString()
    };
}

// CREATE: convierte una iniciativa en proyecto.
async function convertirEnProyecto(iniciativaId, datos, usuarioId) {

    validarId(iniciativaId);

    // Valida la información recibida desde el cliente.
    const informacion = validarDatos(datos);

    // Busca la iniciativa que se desea convertir.
    const iniciativa = await iniciativasModel.buscarPorId(iniciativaId);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Solo el propietario puede realizar la conversión.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede convertir la iniciativa."
        );
    }

    // La iniciativa debe estar abierta.
    if (iniciativa.estado !== "abierta") {
        throw crearError(
            409,
            "ESTADO_NO_PERMITIDO",
            "La iniciativa no está disponible para convertirse."
        );
    }

    // Debe tener al menos otro integrante además del propietario.
    if ((iniciativa.miembros || []).length < 2) {
        throw crearError(
            409,
            "EQUIPO_INSUFICIENTE",
            "La iniciativa necesita al menos otro integrante."
        );
    }

    // Comprueba que no exista otro proyecto para esta iniciativa.
    const existente = await proyectosModel.buscarPorIniciativa(iniciativaId);

    if (existente) {
        throw crearError(
            409,
            "PROYECTO_EXISTENTE",
            "Esta iniciativa ya fue convertida en proyecto."
        );
    }

    const fecha = new Date();

    // Prepara el proyecto utilizando datos de la iniciativa
    // y los nuevos campos enviados por el usuario.
    const nuevoProyecto = {
        iniciativaId,
        nombre: iniciativa.titulo,
        descripcion: iniciativa.descripcion,
        objetivo: informacion.objetivo,
        fechaInicio: informacion.fechaInicio,
        propietarioId: usuarioId,
        miembros: [...iniciativa.miembros],
        estado: "activo",
        repositorioGitHub: informacion.repositorioGitHub,
        fechaCreacion: fecha,
        fechaModificacion: fecha
    };

    // Inicia una sesión para realizar una transacción.
    const sesion = obtenerCliente().startSession();

    try {

        // Ambas operaciones deben completarse correctamente.
        // Si alguna falla, MongoDB revierte los cambios.
        await sesion.withTransaction(async () => {

            // Cambia el estado de la iniciativa a convertida.
            const resultado = await obtenerBaseDatos()
                .collection("iniciativas")
                .updateOne(
                    {
                        _id: new ObjectId(iniciativaId),
                        propietarioId: usuarioId,
                        estado: "abierta",

                        // Verifica que todavía exista otro integrante.
                        "miembros.1": { $exists: true }
                    },
                    {
                        $set: {
                            estado: "convertida",
                            fechaModificacion: fecha
                        }
                    },
                    { session: sesion }
                );

            // Si la iniciativa ya cambió, cancela la operación.
            if (resultado.modifiedCount === 0) {
                throw crearError(
                    409,
                    "OPERACION_NO_COMPLETADA",
                    "No se pudo convertir la iniciativa."
                );
            }

            // Guarda el nuevo proyecto en la misma transacción.
            await proyectosModel.crearProyecto(nuevoProyecto, sesion);
        });

    } catch (error) {

        // El código 11000 indica un valor duplicado en MongoDB.
        if (error.code === 11000) {
            throw crearError(
                409,
                "PROYECTO_EXISTENTE",
                "Esta iniciativa ya fue convertida en proyecto."
            );
        }

        throw error;

    } finally {

        // Cierra la sesión aunque ocurra un error.
        await sesion.endSession();
    }

    // Busca el proyecto creado y prepara su respuesta.
    const proyecto = await proyectosModel.buscarPorIniciativa(iniciativaId);

    return prepararProyecto(proyecto);
}

// READ: consulta los proyectos donde participa el usuario.
async function consultarProyectos(usuarioId) {

    const proyectos = await proyectosModel.listarProyectos(usuarioId);

    // Prepara todos los proyectos para enviarlos al cliente.
    return proyectos.map(proyecto => prepararProyecto(proyecto));
}


// READ: consulta un proyecto específico.
async function consultarDetalle(id, usuarioId) {

    validarId(id);

    const proyecto = await proyectosModel.buscarPorId(id);

    if (!proyecto) {
        throw crearError(
            404,
            "PROYECTO_NO_ENCONTRADO",
            "No se encontró el proyecto."
        );
    }

    // Solo los integrantes pueden consultar el proyecto.
    if (!(proyecto.miembros || []).includes(usuarioId)) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "No tiene acceso a este proyecto."
        );
    }

    // Prepara el proyecto antes de enviarlo al cliente.
    return prepararProyecto(proyecto);
}

// Exporta las funciones que utilizará proyectos.controller.js.
module.exports = {
    convertirEnProyecto,
    consultarProyectos,
    consultarDetalle
};