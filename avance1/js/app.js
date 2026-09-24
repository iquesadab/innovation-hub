/*
Obtiene del DOM el contenedor donde se mostrarán las iniciativas.
*/
const listaIniciativas = document.getElementById("lista-iniciativas");

/*
Función para mostrar las iniciativas en el catálogo.
*/
function mostrarIniciativas(iniciativas) {

    // Limpia el contenido anterior.
    listaIniciativas.innerHTML = "";

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

/*
Función para cargar las iniciativas desde el archivo JSON.
*/
async function cargarIniciativas() {

    try {

        // fetch solicita el archivo que contiene las iniciativas.
        const respuesta = await fetch("../datos/iniciativas.json");

        // Convierte la respuesta recibida a formato JSON.
        const iniciativas = await respuesta.json();

        // Muestra los datos en consola para comprobar que se cargaron.
        console.log(iniciativas);
        mostrarIniciativas(iniciativas);

    } catch (error) {

        // Se ejecuta si ocurre un error durante la carga.
        console.error("Error al cargar las iniciativas:", error);

    }
}


// Ejecuta la función.
cargarIniciativas();