const { ObjectId } = require("mongodb");
const { obtenerBaseDatos } = require("../database/conexion");

// Obtiene la colección de usuarios de MongoDB.
function obtenerColeccion() {
    return obtenerBaseDatos().collection("usuarios");
}

// Busca un usuario mediante su correo.
async function buscarPorCorreo(correo) {
    return await obtenerColeccion().findOne({ correo });
}

// Busca un usuario por su identificador.
async function buscarPorId(id) {
    return await obtenerColeccion().findOne({
        _id: new ObjectId(id)
    });
}

// Guarda un nuevo usuario.
async function crearUsuario(usuario) {
    const resultado = await obtenerColeccion().insertOne(usuario);
    return resultado.insertedId;
}

// Crea un índice para evitar correos repetidos.
async function crearIndiceUsuarios() {
    await obtenerColeccion().createIndex(
        { correo: 1 },
        { unique: true }
    );
}

// Actualiza los datos de un usuario en MongoDB.
async function actualizarUsuario(id, cambios) {
    const resultado = await obtenerColeccion().updateOne(
        { _id: new ObjectId(id) },
        { $set: cambios }
    );

    return resultado.matchedCount;
}


 // Esta función busca usuarios en MongoDB.
 // Recibe tres datos:
 // texto: lo que la persona escribió en el buscador.
 // limite: cantidad máxima de usuarios que queremos mostrar.
 // pagina: número de página que queremos consultar.
async function buscarUsuarios(texto, limite, pagina) {

    // Objeto vacío para guardar las condiciones al buscar usuarios en MongoDB
    // Si queda vacío {}, MongoDB buscará todos los usuarios.
    const filtro = {};

    // Revisamos si la persona escribió algo en el buscador.
    // Si no escribió nada, no agregamos filtros de texto.
    if (texto) {

        // replace() permite reemplazar caracteres dentro de un texto.
        // Esta expresión busca símbolos especiales como
        // Los símbolos pueden tener un significado especial
        // cuando MongoDB realiza búsquedas con expresiones regulares.
        // Por eso, agregamos una barra invertida delante de ellos
        // para que se busquen como caracteres normales.
        const textoSeguro = texto.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        // $or significa "O".
        // MongoDB buscará usuarios que cumplan al menos
        // una de estas dos condiciones:
        // 1. Que el nombre contenga el texto buscado.
        // 2. Que la carrera contenga el texto buscado.
        // $regex permite buscar coincidencias dentro de un texto.
        // $options: "i" ignora las diferencias entre mayúsculas
        // y minúsculas.
        filtro.$or = [
            {
                nombre: {
                    $regex: textoSeguro,
                    $options: "i"
                }
            },
            {
                carrera: {
                    $regex: textoSeguro,
                    $options: "i"
                }
            }
        ];
    }

    // Calculamos cuántos usuarios debemos saltar antes de mostrar los resultados.
    // Esto se utiliza para dividir los resultados en páginas.
    //
    // Ejemplo: queremos mostrar 10 usuarios por página.
    //
    // Página 1: (1 - 1) * 10 = 0
    // No saltamos ninguno.
    //
    // Página 2: (2 - 1) * 10 = 10
    // Saltamos los primeros 10.
    //
    // Página 3: (3 - 1) * 10 = 20
    // Saltamos los primeros 20.
    const saltar = (pagina - 1) * limite;

    // Ahora realizamos la búsqueda en MongoDB.
    const usuarios = await obtenerColeccion()

        // find() busca los usuarios que cumplen el filtro.
        // Si el filtro está vacío, obtiene todos los usuarios.
        .find(filtro)

        // project() indica qué información queremos recibir.
        // El número 1 significa que queremos incluir ese campo.
        //
        // No incluimos el correo ni la contraseña.
        // MongoDB también devuelve _id de forma predeterminada.
        .project({
            nombre: 1,
            carrera: 1,
            competencias: 1,
            disponibilidad: 1
        })

        // sort() ordena los resultados.
        //
        // nombre: 1 significa orden alfabético ascendente.
        // _id: 1 permite mantener un orden estable cuando dos usuarios tienen el mismo nombre.
        .sort({
            nombre: 1,
            _id: 1
        })

        // skip() salta los usuarios de páginas anteriores.
        .skip(saltar)

        // limit() establece cuántos usuarios como máximo
        // queremos recibir.
        .limit(limite)

        // Convierte los resultados de MongoDB en un arreglo de JavaScript que podemos recorrer.
        .toArray();

    // Cuenta todos los usuarios que cumplen el filtro, sin importar cuántos mostramos en esta página.
    const total = await obtenerColeccion()
        .countDocuments(filtro);

    // Devolvemos dos cosas:
    //
    // usuarios: los resultados de la página solicitada.
    // total: la cantidad total de coincidencias.
    return {
        usuarios,
        total
    };
}

module.exports = {
    buscarPorCorreo,
    buscarPorId,
    crearUsuario,
    crearIndiceUsuarios,
    actualizarUsuario,
    buscarUsuarios
};