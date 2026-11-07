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
    // jwt.sign() = Crea el token.
    // usuario._id.toString() = Coloca el identificador dentro del token.
    // process.env.JWT_SECRET = Es una clave secreta del servidor que permite firmarlo.
    // expiresIn: "2h" = El token vence después de 2 horas.
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

// Obtiene los datos del perfil del usuario que inició sesión.
async function obtenerPerfil(id) {

    // Comprueba que el identificador tenga el formato correcto.
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "El identificador del usuario no es válido."
        );
    }

    // Busca al usuario en MongoDB.
    const usuario = await usuariosModel.buscarPorId(id);

    // Si no existe, devuelve un error.
    if (!usuario) {
        throw crearError(
            404,
            "USUARIO_NO_ENCONTRADO",
            "No se encontró el usuario."
        );
    }

    // Devuelve solamente los datos que podemos mostrar.
    return {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        correo: usuario.correo,
        carrera: usuario.carrera,
        competencias: usuario.competencias,
        disponibilidad: usuario.disponibilidad
    };
}


 // Esta función permite modificar los datos del perfil de un usuario.
 // Recibe dos parámetros:
 // id: identifica al usuario que quiere modificar su perfil.
 // datos: contiene la información nueva que envió el usuario.
async function editarPerfil(id, datos) {

    // Buscamos el perfil para comprobar que el usuario existe.
    // Si no existe, obtenerPerfil() genera un error.
    await obtenerPerfil(id);

    // Creamos una lista con los campos que sí se pueden modificar.
    // Por seguridad, no incluimos el ID, el correo ni la contraseña.
    const camposPermitidos = [
        "nombre",
        "carrera",
        "competencias",
        "disponibilidad"
    ];

    // Comprobamos que el usuario haya enviado información válida.
    //
    // !datos: revisa que no sea null, undefined u otro valor vacío.
    // typeof datos !== "object": comprueba que sea un objeto.
    // Array.isArray(datos): evita que envíen una lista en lugar de un objeto.
    // Object.keys(datos).length === 0: evita recibir un objeto vacío {}.
    //
    // Si ocurre alguna de estas situaciones, no continuamos.
    if (
        !datos ||
        typeof datos !== "object" ||
        Array.isArray(datos) ||
        Object.keys(datos).length === 0
    ) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Debe enviar los datos que desea modificar."
        );
    }

    // Object.keys() obtiene los nombres de los campos recibidos.
    //
    // Ejemplo:
    // datos = { nombre: "Ana", carrera: "Software" }
    // camposRecibidos = ["nombre", "carrera"]
    const camposRecibidos = Object.keys(datos);

    // Revisamos que todos los campos recibidos estén permitidos.
    //
    // some(): comprueba si al menos un campo cumple la condición.
    // includes(): comprueba si el campo está en camposPermitidos.
    if (
        camposRecibidos.some(campo =>
            !camposPermitidos.includes(campo)
        )
    ) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Hay campos que no se pueden modificar."
        );
    }

    // Creamos un objeto vacío donde guardaremos los datos
    // que ya hayan pasado todas las validaciones.
    const cambios = {};

    // Recorremos los tres campos que deben contener texto.
    //
    // No incluimos competencias porque ese campo es una lista
    // y necesita validaciones diferentes.
    for (const campo of ["nombre", "carrera", "disponibilidad"]) {

        // Revisamos si el usuario envió este campo.
        //
        // Por ejemplo, si solamente envió "carrera",
        // no necesitamos revisar ni modificar "nombre".
        if (datos[campo] !== undefined) {

            // Comprobamos que el valor sea texto.
            if (typeof datos[campo] !== "string") {
                throw crearError(
                    400,
                    "DATOS_INVALIDOS",
                    `El campo ${campo} debe ser texto.`
                );
            }

            const valor = datos[campo].trim();

            // Definimos la cantidad mínima de caracteres.
            //
            // Si estamos revisando el nombre, el mínimo es 3.
            // Para carrera y disponibilidad, el mínimo es 2.
            //
            // El signo ? significa "si se cumple la condición".
            // Los dos puntos : indican el valor alternativo.
            const minimo = campo === "nombre" ? 3 : 2;

            // Revisamos que el texto tenga una longitud válida.
            //
            // No permitimos menos del mínimo ni más de 100.
            if (valor.length < minimo || valor.length > 100) {
                throw crearError(
                    400,
                    "DATOS_INVALIDOS",
                    `Revise la longitud del campo ${campo}.`
                );
            }

            // Si pasó las validaciones, guardamos el valor.
            //
            // Ejemplo:
            // campo = "carrera"
            // valor = "Ingeniería en Software"
            //
            // Resultado:
            // cambios.carrera = "Ingeniería en Software"
            cambios[campo] = valor;
        }
    }

    // Ahora revisamos las competencias.
    // Solo hacemos esta revisión si el usuario las envió.
    if (datos.competencias !== undefined) {

        // Comprobamos tres cosas:
        //
        // 1. Que competencias sea una lista (array).
        // 2. Que no tenga más de 20 competencias.
        // 3. Que cada competencia sea texto y tenga
        //    entre 2 y 50 caracteres, sin contar espacios
        //    al inicio o al final.

        if (
            !Array.isArray(datos.competencias) ||
            datos.competencias.length > 20 ||
            datos.competencias.some(competencia =>
                typeof competencia !== "string" ||
                competencia.trim().length < 2 ||
                competencia.trim().length > 50
            )
        ) {
            throw crearError(
                400,
                "DATOS_INVALIDOS",
                "Revise las competencias."
            );
        }

        // map() recorre todas las competencias y crea una lista nueva sin espacios innecesarios.
        const competencias = datos.competencias.map(
            competencia => competencia.trim()
        );

        // Convertimos las competencias a minúsculas para poder detectar si alguna está repetida.
        // Set es una estructura que no guarda valores duplicados.
        const unicas = new Set(
            competencias.map(
                competencia => competencia.toLowerCase()
            )
        );

        // Comparamos cuántas competencias recibimos con cuántas quedaron después de eliminar repetidas.
        // Si las cantidades son diferentes, significa que había al menos una competencia duplicada.
        if (unicas.size !== competencias.length) {
            throw crearError(
                400,
                "DATOS_INVALIDOS",
                "No puede repetir competencias."
            );
        }

        // Si todas las competencias son válidas,
        // las agregamos al objeto de cambios.
        cambios.competencias = competencias;
    }

    // Enviamos los cambios al modelo de usuarios.
    // actualizarUsuario() utiliza MongoDB para modificar solamente los campos que guardamos en "cambios".
    // MongoDB modifica ese campo y conserva los demás.
    await usuariosModel.actualizarUsuario(id, cambios);

    // Consultamos nuevamente el perfil para obtener los datos actualizados desde MongoDB.
    // return devuelve esa información al controlador, que posteriormente responderá al usuario.
    return await obtenerPerfil(id);
}

// Consulta usuarios aplicando búsqueda, filtros y paginación.
async function consultarUsuarios(filtros = {}) {

    // Extraemos los valores del objeto filtros.
    // Si el usuario no envía alguno, utilizamos los valores que aparecen después del signo =.
    // buscar = "": si no escribió nada, buscamos sin texto.
    // pagina = "1": comenzamos en la primera página.
    // limite = "10": mostramos hasta 10 usuarios por página.
    // Estos valores llegan como texto desde la URL.
    const {
        buscar = "",
        carrera = "",
        competencia = "",
        disponibilidad = "",
        pagina = "1",
        limite = "10"
    } = filtros;

    // Valida los campos de búsqueda.
    const textos = [
        buscar,
        carrera,
        competencia,
        disponibilidad
    ];

    if (textos.some(texto =>
        typeof texto !== "string" || texto.length > 100
    )) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Los filtros de búsqueda no son válidos."
        );
    }

    // Comprueba que página y límite sean enteros positivos.
    if (!/^[1-9]\d*$/.test(String(pagina)) ||
        !/^[1-9]\d*$/.test(String(limite))) {

        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "La página y el límite deben ser números positivos."
        );
    }


    // Number() convierte los valores recibidos a números.
    // Necesario porque vamos a realizar operaciones matemáticas para calcular las páginas.
    const numeroPagina = Number(pagina);
    const numeroLimite = Number(limite);

    // Otras validaciones.
    // Number.isSafeInteger() comprueba que el número sea un entero que JavaScript pueda manejar
    // numeroLimite > 50: No permitimos solicitar más de 50 usuarios por página.
    // (numeroPagina - 1) * numeroLimite > 100000:
    // Evita que una petición intente saltar una cantidad demasiado grande de registros
    if (
        !Number.isSafeInteger(numeroPagina) ||
        !Number.isSafeInteger(numeroLimite) ||
        numeroLimite > 50 ||
        (numeroPagina - 1) * numeroLimite > 100000
    ) {
        throw crearError(
            400,
            "DATOS_INVALIDOS",
            "Revise la página y la cantidad de resultados."
        );
    }

    // Prepara los filtros para el modelo.
    const filtrosBusqueda = {
        carrera: carrera.trim(),
        competencia: competencia.trim(),
        disponibilidad: disponibilidad.trim()
    };

    // Llamamos a la función buscarUsuarios() del modelo.
    // Le enviamos:
    // 1. El texto sin espacios al inicio ni al final.
    // 2. La cantidad máxima de usuarios.
    // 3. El número de página.
    // El modelo se encarga de buscar en MongoDB.
    const resultado = await usuariosModel.buscarUsuarios(
        buscar.trim(),
        numeroLimite,
        numeroPagina,
        filtrosBusqueda
    );

    // MongoDB guarda el identificador como un ObjectId.
    // Aquí utilizamos map() para recorrer los usuarios encontrados y preparar una nueva lista.
    // toString() convierte el identificador a texto
    // También seleccionamos únicamente los datos que queremos enviar como respuesta.
    const usuarios = resultado.usuarios.map(usuario => ({
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        carrera: usuario.carrera,
        competencias: usuario.competencias,
        disponibilidad: usuario.disponibilidad
    }));

    // Devolvemos los usuarios y la información necesaria para manejar la paginación.
    // usuarios: lista de usuarios encontrados.
    // total: cantidad total de coincidencias.
    // pagina: página consultada.
    // limite: máximo de usuarios por página.
    return {
        usuarios,
        total: resultado.total,
        pagina: numeroPagina,
        limite: numeroLimite
    };
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil,
    editarPerfil,
    consultarUsuarios
};