const iniciativasModel = require("../models/iniciativas.model");


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
            "El identificador de la iniciativa no es válido."
        );
    }
}


// Valida las listas de competencias y etiquetas.
function validarLista(lista, nombre) {

    // Comprueba que sea una lista de máximo 20 elementos.
    // Cada elemento debe ser texto de entre 2 y 50 caracteres.
    if (!Array.isArray(lista) ||
        lista.length > 20 ||
        lista.some(valor =>
            typeof valor !== "string" ||
            valor.trim().length < 2 ||
            valor.trim().length > 50)) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            `Revise el campo ${nombre}.`
        );
    }

    // map() recorre la lista y elimina los espacios innecesarios.
    const valores = lista.map(valor => valor.trim());

    // Set permite comprobar que no existan elementos repetidos.
    const unicos = new Set(
        valores.map(valor => valor.toLowerCase())
    );

    if (unicos.size !== valores.length) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            `No puede repetir valores en ${nombre}.`
        );
    }

    return valores;
}


// Comprueba los datos recibidos al crear o modificar una iniciativa.
function validarDatos(datos) {

    // Revisa que se haya enviado un objeto y no una lista.
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Debe enviar los datos de la iniciativa."
        );
    }

    // Estos son los únicos campos que puede enviar el usuario.
    // El propietario, el estado y las fechas los asigna el servidor.
    const camposPermitidos = [
        "titulo",
        "tipo",
        "resumen",
        "descripcion",
        "problema",
        "beneficiarios",
        "categoria",
        "competencias",
        "miembrosEstimados",
        "visibilidad",
        "etiquetas"
    ];

    // Object.keys() obtiene los nombres de los campos recibidos.
    // some() comprueba si alguno no aparece en camposPermitidos.
    if (Object.keys(datos).some(campo =>
        !camposPermitidos.includes(campo))) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La iniciativa contiene campos no permitidos."
        );
    }

    // Establecemos el mínimo y máximo de caracteres de cada campo.
    const limites = {
        titulo: [3, 150],
        resumen: [10, 500],
        descripcion: [10, 5000],
        problema: [0, 3000],
        beneficiarios: [0, 1000],
        categoria: [2, 100]
    };

    // Aquí guardaremos los datos después de validarlos.
    const resultado = {};

    // Object.entries() permite recorrer cada campo junto con sus límites.
    // Ejemplo: para titulo, minimo = 3 y maximo = 150.
    for (const [campo, [minimo, maximo]] of Object.entries(limites)) {

        const valor = datos[campo];

        // Problema y beneficiarios son opcionales.
        const opcional = campo === "problema" ||
            campo === "beneficiarios";

        // continue permite pasar al siguiente campo del ciclo.
        if (valor === undefined && opcional) {
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

    // Comprueba que el tipo corresponda a una opción permitida.
    if (!["idea", "necesidad", "reto"].includes(datos.tipo)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El tipo debe ser idea, necesidad o reto."
        );
    }

    // Comprueba los cuatro niveles de visibilidad.
    if (!["publica", "institucional", "restringida", "privada"]
        .includes(datos.visibilidad)) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El nivel de visibilidad no es válido."
        );
    }

    // Number.isSafeInteger() comprueba que sea un número entero válido.
    // La cantidad estimada debe estar entre 1 y 1000.
    if (!Number.isSafeInteger(datos.miembrosEstimados) ||
        datos.miembrosEstimados < 1 ||
        datos.miembrosEstimados > 1000) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La cantidad estimada de integrantes no es válida."
        );
    }

    resultado.tipo = datos.tipo;
    resultado.visibilidad = datos.visibilidad;
    resultado.miembrosEstimados = datos.miembrosEstimados;

    // Si no se enviaron competencias o etiquetas, utilizamos listas vacías.
    resultado.competencias = validarLista(
        datos.competencias === undefined ? [] : datos.competencias,
        "competencias"
    );

    resultado.etiquetas = validarLista(
        datos.etiquetas === undefined ? [] : datos.etiquetas,
        "etiquetas"
    );

    return resultado;
}


// Prepara los datos que podemos mostrar según la visibilidad.
function prepararIniciativa(iniciativa, usuarioId) {

    // Comprueba si el usuario es el propietario.
    const esPropietario = iniciativa.propietarioId === usuarioId;

    // Información general de la iniciativa.
    const datos = {
        id: iniciativa._id.toString(),
        titulo: iniciativa.titulo,
        tipo: iniciativa.tipo,
        resumen: iniciativa.resumen,
        categoria: iniciativa.categoria,
        propietarioId: iniciativa.propietarioId,
        visibilidad: iniciativa.visibilidad,
        estado: iniciativa.estado,
        fechaCreacion: iniciativa.fechaCreacion,
        fechaModificacion: iniciativa.fechaModificacion
    };

    // Una iniciativa privada solamente puede verla su propietario.
    if (iniciativa.visibilidad === "privada" && !esPropietario) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Por ahora, las institucionales solo son visibles
    // para su propietario, hasta implementar la validación institucional.
    if (iniciativa.visibilidad === "institucional" && !esPropietario) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "No tiene acceso a esta iniciativa."
        );
    }

    // En una iniciativa restringida, otros usuarios
    // solamente pueden consultar la información general.
    if (iniciativa.visibilidad === "restringida" && !esPropietario) {
        return datos;
    }

    // ...datos copia los campos anteriores y agrega los detalles.
    return {
        ...datos,
        descripcion: iniciativa.descripcion,
        problema: iniciativa.problema,
        beneficiarios: iniciativa.beneficiarios,
        competencias: iniciativa.competencias,
        miembrosEstimados: iniciativa.miembrosEstimados,
        miembros: iniciativa.miembros || [],
        etiquetas: iniciativa.etiquetas
    };
}


// CREATE: registra una iniciativa nueva.
async function crearIniciativa(datos, usuarioId) {

    // Valida los datos que envió el usuario.
    const informacion = validarDatos(datos);
    const fecha = new Date();

    // Construye la iniciativa con los datos validados.
    // ...informacion copia todos los campos de ese objeto.
    const nuevaIniciativa = {
        ...informacion,
        propietarioId: usuarioId,
        miembros: [usuarioId],
        estado: "abierta",
        fechaCreacion: fecha,
        fechaModificacion: fecha
    };

    // Guarda la iniciativa en MongoDB y obtiene su ID.
    const id = await iniciativasModel.crearIniciativa(nuevaIniciativa);

    return await consultarDetalle(id, usuarioId);
}


// READ: consulta una iniciativa por su ID.
async function consultarDetalle(id, usuarioId) {

    validarId(id);

    const iniciativa = await iniciativasModel.buscarPorId(id);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Devuelve los datos que el usuario tiene permiso de consultar.
    return prepararIniciativa(iniciativa, usuarioId);
}


// READ: busca iniciativas utilizando filtros y paginación.
async function consultarIniciativas(filtros, usuarioId) {

    // Extraemos los filtros enviados en la URL.
    // Si no se envían, utilizamos los valores predeterminados.
    const {
        type = "",
        category = "",
        skill = "",
        q = "",
        page = "1",
        size = "10"
    } = filtros;

    const pagina = Number(page);
    const limite = Number(size);

    // Comprueba que la página y el límite sean números positivos.
    // También evita solicitar más de 50 iniciativas por página.
    if (!/^[1-9]\d*$/.test(String(page)) ||
        !/^[1-9]\d*$/.test(String(size)) ||
        !Number.isSafeInteger(pagina) ||
        !Number.isSafeInteger(limite) ||
        limite > 50 ||
        (pagina - 1) * limite > 100000) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La paginación no es válida."
        );
    }

    // Comprueba que los filtros sean textos de máximo 100 caracteres.
    if ([type, category, skill, q].some(valor =>
        typeof valor !== "string" || valor.length > 100)) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Los filtros no son válidos."
        );
    }

    if (type && !["idea", "necesidad", "reto"].includes(type)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El tipo de iniciativa no es válido."
        );
    }

    // $or significa que puede cumplirse cualquiera de las condiciones.
    // $in comprueba si el valor está dentro de la lista.
    //
    // Mostramos iniciativas públicas, restringidas y las del propietario.
    // Excluimos las archivadas del catálogo normal.
    const filtro = {
        estado: { $ne: "archivada" },
        $or: [
            { visibilidad: { $in: ["publica", "restringida"] } },
            { propietarioId: usuarioId }
        ]
    };

    if (type) {
        filtro.tipo = type;
    }

    if (category) {
        filtro.categoria = category;
    }

    // Evita que los símbolos especiales alteren la búsqueda.
    function textoSeguro(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // $regex permite buscar coincidencias dentro de un texto.
    // $options: "i" ignora mayúsculas y minúsculas.
    if (skill) {
        filtro.competencias = {
            $regex: textoSeguro(skill),
            $options: "i"
        };
    }

    // Busca el texto en el título o en el resumen.
    if (q) {
        filtro.$and = [{
            $or: [
                {
                    titulo: {
                        $regex: textoSeguro(q),
                        $options: "i"
                    }
                },
                {
                    resumen: {
                        $regex: textoSeguro(q),
                        $options: "i"
                    }
                }
            ]
        }];
    }

    // Consulta MongoDB utilizando los filtros preparados.
    const resultado = await iniciativasModel.listarIniciativas(
        filtro,
        pagina,
        limite
    );

    // map() prepara cada iniciativa según su visibilidad.
    return {
        iniciativas: resultado.iniciativas.map(iniciativa =>
            prepararIniciativa(iniciativa, usuarioId)
        ),
        total: resultado.total,
        pagina,
        limite
    };
}


// UPDATE: modifica una iniciativa existente.
async function editarIniciativa(id, datos, usuarioId) {

    validarId(id);

    const iniciativa = await iniciativasModel.buscarPorId(id);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Solamente el propietario puede modificar su iniciativa.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede modificar esta iniciativa."
        );
    }

    // Una iniciativa archivada o convertida ya no puede editarse.
    if (iniciativa.estado !== "abierta") {
        throw crearError(
            409,
            "ESTADO_NO_PERMITIDO",
            "No puede modificar una iniciativa archivada o convertida."
        );
    }

    // PUT recibe todos los campos editables de la iniciativa.
    const cambios = validarDatos(datos);
    cambios.fechaModificacion = new Date();

    await iniciativasModel.actualizarIniciativa(
        id,
        usuarioId,
        cambios
    );

    return await consultarDetalle(id, usuarioId);
}


// DELETE: elimina o archiva una iniciativa.
async function eliminarIniciativa(id, usuarioId) {

    validarId(id);

    const iniciativa = await iniciativasModel.buscarPorId(id);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Comprueba que la iniciativa pertenezca al usuario.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede eliminar esta iniciativa."
        );
    }

    // Una iniciativa convertida debe conservarse porque tiene un proyecto asociado.
    if (iniciativa.estado === "convertida") {
        throw crearError(
            409,
            "INICIATIVA_CONVERTIDA",
            "No puede eliminar una iniciativa que ya fue convertida en proyecto."
        );
    }

    if (iniciativa.estado === "archivada") {
        throw crearError(
            409,
            "INICIATIVA_ARCHIVADA",
            "La iniciativa ya está archivada."
        );
    }

    // Si existen miembros, solicitudes o proyectos relacionados,
    // debemos conservar la iniciativa y archivarla.
    const tieneRelaciones =
        (iniciativa.miembros || []).length > 1 ||
        await iniciativasModel.tieneSolicitudes(id) ||
        await iniciativasModel.tieneProyecto(id);

    if (tieneRelaciones) {

        // $set en el modelo actualizará el estado a "archivada".
        await iniciativasModel.actualizarIniciativa(
            id,
            usuarioId,
            {
                estado: "archivada",
                fechaModificacion: new Date()
            }
        );

        return "archivada";
    }

    // Si no existen relaciones, eliminamos el documento de MongoDB.
    await iniciativasModel.eliminarIniciativa(id, usuarioId);

    return "eliminada";
}


// Consulta los integrantes de una iniciativa.
async function consultarMiembros(id, usuarioId) {

    validarId(id);

    const iniciativa = await iniciativasModel.buscarPorId(id);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Solo el propietario puede consultar la lista completa.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede consultar los integrantes."
        );
    }

    return iniciativa.miembros || [];
}


// Permite al propietario eliminar un integrante del equipo.
async function quitarMiembro(id, miembroId, usuarioId) {

    validarId(id);
    validarId(miembroId);

    const iniciativa = await iniciativasModel.buscarPorId(id);

    if (!iniciativa) {
        throw crearError(
            404,
            "INICIATIVA_NO_ENCONTRADA",
            "No se encontró la iniciativa."
        );
    }

    // Comprueba que quien realiza la acción sea el propietario.
    if (iniciativa.propietarioId !== usuarioId) {
        throw crearError(
            403,
            "ACCESO_DENEGADO",
            "Solo el propietario puede eliminar integrantes."
        );
    }

    // El propietario no puede eliminarse a sí mismo.
    if (miembroId === iniciativa.propietarioId) {
        throw crearError(
            409,
            "OPERACION_NO_PERMITIDA",
            "El propietario no puede eliminarse del equipo."
        );
    }

    // No permite modificar equipos de iniciativas cerradas.
    if (iniciativa.estado !== "abierta") {
        throw crearError(
            409,
            "ESTADO_NO_PERMITIDO",
            "No puede modificar el equipo de una iniciativa archivada o convertida."
        );
    }

    // Comprueba que el integrante pertenezca al equipo.
    if (!(iniciativa.miembros || []).includes(miembroId)) {
        throw crearError(
            404,
            "MIEMBRO_NO_ENCONTRADO",
            "El usuario no pertenece al equipo."
        );
    }

    const eliminados = await iniciativasModel.eliminarMiembro(
        id,
        usuarioId,
        miembroId
    );

    if (eliminados === 0) {
        throw crearError(
            409,
            "OPERACION_NO_COMPLETADA",
            "No se pudo eliminar al integrante."
        );
    }

    return await consultarMiembros(id, usuarioId);
}


// Exportamos las funciones que utilizará iniciativas.controller.js.
module.exports = {
    crearIniciativa,
    consultarDetalle,
    consultarIniciativas,
    editarIniciativa,
    eliminarIniciativa,
    consultarMiembros,
    quitarMiembro
};