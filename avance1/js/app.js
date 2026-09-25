/*
Obtiene del DOM el contenedor donde se mostrarán las iniciativas.
*/
const listaIniciativas = document.getElementById("lista-iniciativas");
// Obtiene del DOM el campo utilizado para buscar iniciativas.
const campoBusqueda = document.getElementById("busqueda");
// Obtiene del DOM el formulario que contiene la búsqueda y los filtros.
const formularioFiltros = document.getElementById("form-filtros");
/* Obtiene del DOM el select utilizado para filtrar las iniciativas por tipo */
const filtroTipo = document.getElementById("filtro-tipo");
/* Obtiene del DOM el select utilizado para filtrar las iniciativas por categoría */
const filtroCategoria = document.getElementById("filtro-categoria");
/* Obtiene del DOM el select utilizado para filtrar las iniciativas por competencia */
const filtroCompetencia = document.getElementById("filtro-competencia");

// Guarda todas las iniciativas cargadas desde el JSON.
// Se declara fuera de las funciones para poder utilizarla
// posteriormente en la búsqueda y los filtros.
let iniciativas = [];

/*
Función para mostrar las iniciativas en el catálogo.
*/
function mostrarIniciativas(iniciativas) {

    // Limpia el contenido anterior.
    listaIniciativas.innerHTML = "";

    // Muestra un mensaje cuando ningún resultado
    // coincide con la búsqueda y los filtros.
    if (iniciativas.length === 0) {

        listaIniciativas.innerHTML = `
        <div class="col-12">
            <p class="alert alert-info">
                No se encontraron iniciativas que coincidan
                con los criterios de búsqueda.
            </p>
        </div>
    `;

        return;
    }

    // Recorre cada iniciativa.
    iniciativas.forEach(function (iniciativa) {

        // Crea una columna para la tarjeta.
        const columna = document.createElement("div");

        // Agrega las clases de Bootstrap a la columna.
        columna.className = "col-12 col-md-6 col-lg-4";

        // Crea la tarjeta de la iniciativa.
        const tarjeta = document.createElement("article");

        // h-100: height: 100%, tarjetas misma altura sin importar el texto
        tarjeta.className = "card h-100";

        // innerHTML permite agregar contenido HTML dentro de la tarjeta.
        // Las comillas invertidas ` ` permiten escribir el HTML en varias líneas.
        // ${ } permite insertar dentro del HTML los datos que vienen de JavaScript.
        tarjeta.innerHTML = `

        <div class="card-body">

            <!--
            iniciativa.titulo: obtiene el título de la iniciativa
            actual que estamos recorriendo con el forEach.
            -->
            <h3 class="card-title">
                ${iniciativa.titulo}
            </h3>


            <!--
            Obtiene el tipo y la categoría de la iniciativa.
            El punto · solamente se utiliza para separarlos visualmente.
            -->
            <p>
                ${iniciativa.tipo} · ${iniciativa.categoria}
            </p>


            <!--
            iniciativa.resumen: obtiene el resumen guardado
            en el archivo JSON.
            -->
            <p class="card-text">
                ${iniciativa.resumen}
            </p>


            <!--
            iniciativa.propietario: obtiene el nombre de la persona
            propietaria de la iniciativa.
            -->
            <p>
                <strong>Publicado por:</strong>
                ${iniciativa.propietario}
            </p>


            <!--
            Como competencias es un arreglo en el JSON, uso join(", ") para unir los elementos del arreglo 
            en un solo texto y coloca una coma entre cada competencia.
            -->
            <p>
                <strong>Competencias:</strong>
                ${iniciativa.competencias.join(", ")}
            </p>

            <p>
                <strong>Estado:</strong>
                ${iniciativa.estado}
            </p>

            <!--
            miembros también es un arreglo.
            .length obtiene la cantidad de elementos que tiene el arreglo.

            miembrosEstimados obtiene del JSON la cantidad total
            de personas que se espera tener en la iniciativa.
            -->
            <p>
                ${iniciativa.miembros.length}
                de
                ${iniciativa.miembrosEstimados}
                miembros
            </p>


            <!--
            El id de la iniciativa se agrega al enlace.

            Esto permitirá que detalle.html sepa cuál iniciativa
            debe mostrar.
            -->
            <a
                href="detalle.html?id=${iniciativa.id}"
                class="btn btn-primary"
            >
                Ver iniciativa
            </a>

        </div>
    `;

        // Coloca la tarjeta dentro de la columna.
        columna.appendChild(tarjeta);

        // Coloca la columna dentro del catálogo.
        listaIniciativas.appendChild(columna);
    });

}

/* Función para normalizar un texto. Convierte el texto a minúsculas y elimina las tildes 
para facilitar las búsquedas */
function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

/* Filtra las iniciativas según el texto, tipo, categoría y competencia seleccionados */
function filtrarIniciativas() {

    // Obtiene los valores de los filtros.
    const textoBusqueda =
        normalizarTexto(campoBusqueda.value);

    const tipoSeleccionado =
        filtroTipo.value;

    const categoriaSeleccionada =
        filtroCategoria.value;

    const competenciaBuscada =
        normalizarTexto(filtroCompetencia.value);


    // Filtra todas las iniciativas.
    const resultados = iniciativas.filter(function (iniciativa) {

        // Une el contenido visible de la iniciativa
        // para realizar la búsqueda general.
        const contenidoIniciativa = `
            ${iniciativa.titulo}
            ${iniciativa.tipo}
            ${iniciativa.categoria}
            ${iniciativa.resumen}
            ${iniciativa.propietario}
            ${iniciativa.competencias.join(" ")}
            ${iniciativa.estado}
        `;

        // Verifica la búsqueda general.
        const coincideTexto =
            normalizarTexto(contenidoIniciativa)
                .includes(textoBusqueda);


        // Verifica el tipo.
        const coincideTipo =
            tipoSeleccionado === "" ||
            iniciativa.tipo === tipoSeleccionado;


        // Verifica la categoría.
        const coincideCategoria =
            categoriaSeleccionada === "" ||
            iniciativa.categoria === categoriaSeleccionada;


        // Une las competencias para poder buscarlas como texto.
        const competencias =
            normalizarTexto(iniciativa.competencias.join(" "));


        // Verifica la competencia.
        const coincideCompetencia =
            competenciaBuscada === "" ||
            competencias.includes(competenciaBuscada);


        // La iniciativa debe cumplir todos los filtros.
        return coincideTexto &&
            coincideTipo &&
            coincideCategoria &&
            coincideCompetencia;
    });

    // Muestra las iniciativas que cumplen los filtros.
    mostrarIniciativas(resultados);
}

/*
Función para cargar las iniciativas desde el archivo JSON.
*/
async function cargarIniciativas() {

    // Muestra un mensaje mientras se cargan las iniciativas.
    listaIniciativas.innerHTML = `
        <div class="col-12">
            <p class="alert alert-info">
                Cargando iniciativas...
            </p>
        </div>
    `;

    try {

        // fetch solicita el archivo que contiene las iniciativas.
        const respuesta = await fetch("../datos/iniciativas.json");

        // Verifica que el archivo se haya cargado correctamente.
        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las iniciativas."
            );
        }

        // Guarda las iniciativas obtenidas del JSON
        // en la variable general.
        iniciativas = await respuesta.json();

        // Muestra los datos en consola para comprobar que se cargaron.
        console.log(iniciativas);
        mostrarIniciativas(iniciativas);

    } catch (error) {

        // Se ejecuta si ocurre un error durante la carga.
        console.error("Error al cargar las iniciativas:", error);

        // Muestra un mensaje de error en el catálogo.
        listaIniciativas.innerHTML = `
            <div class="col-12">
                <p class="alert alert-danger">
                    No fue posible cargar las iniciativas.
                    Intente nuevamente más tarde.
                </p>
            </div>
        `;
    }
}

/* Función para cargar los tipos de iniciativa desde el archivo JSON */
async function cargarTipos() {

    try {

        // Solicita el archivo que contiene los tipos.
        const respuesta =
            await fetch("../datos/tipos.json");

        // Convierte la respuesta a formato JSON.
        const tipos =
            await respuesta.json();

        // Recorre cada tipo obtenido del JSON.
        tipos.forEach(function (tipo) {

            // Crea una nueva opción para el select.
            const opcion =
                document.createElement("option");

            // Asigna el tipo como valor de la opción.
            opcion.value = tipo;

            // Asigna el tipo como texto visible.
            opcion.textContent = tipo;

            // Agrega la opción al select.
            filtroTipo.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar los tipos:",
            error
        );
    }
}

/* Función para cargar las categorías desde el archivo JSON */
async function cargarCategorias() {

    try {

        // Solicita el archivo que contiene las categorías.
        const respuesta =
            await fetch("../datos/categorias.json");

        // Convierte la respuesta a formato JSON.
        const categorias =
            await respuesta.json();

        // Recorre cada categoría obtenida del JSON.
        categorias.forEach(function (categoria) {

            // Crea una nueva opción para el select.
            const opcion =
                document.createElement("option");

            // Asigna la categoría como valor de la opción.
            opcion.value = categoria;

            // Asigna la categoría como texto visible.
            opcion.textContent = categoria;

            // Agrega la opción al select.
            filtroCategoria.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar las categorías:",
            error
        );
    }
}

/* Ejecuta los filtros cuando cambia alguno de los campos de búsqueda */
campoBusqueda.addEventListener(
    "input",
    filtrarIniciativas
);

filtroTipo.addEventListener(
    "change",
    filtrarIniciativas
);

filtroCategoria.addEventListener(
    "change",
    filtrarIniciativas
);

filtroCompetencia.addEventListener(
    "input",
    filtrarIniciativas
);

/* Evita que el formulario recargue la página
cuando el usuario presiona Enter */
formularioFiltros.addEventListener("submit", function (evento) {
    evento.preventDefault();
});

// Ejecuta la función.
cargarIniciativas();

cargarTipos();
cargarCategorias();