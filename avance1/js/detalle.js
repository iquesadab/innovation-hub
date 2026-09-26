/* Obtiene del DOM el espacio donde se mostrará la información de la iniciativa */
const detalleIniciativa = document.getElementById("detalle-iniciativa");

/* Obtiene los parámetros que vienen en la URL */
const parametros = new URLSearchParams(window.location.search);

// Obtiene específicamente el valor del parámetro "id".
const idIniciativa = Number(parametros.get("id"));


/* Función para cargar las iniciativas desde el JSON y buscar la iniciativa seleccionada */
async function cargarDetalle() {

    try {
        const respuesta =
            await fetch("../datos/iniciativas.json");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las iniciativas."
            );

        }

        // Convierte la respuesta a formato JSON.
        const iniciativas = await respuesta.json();


        /* Busca dentro del arreglo la iniciativa cuyo id coincide con el recibido en la URL */
        const iniciativa = iniciativas.find(function(iniciativa) {
                return iniciativa.id === idIniciativa;
            });

        // Verifica que la iniciativa exista.
        if (!iniciativa) {
            mostrarError( "No se encontró la iniciativa solicitada." );
            return;
        }

        if (iniciativa.visibilidad === "Restringida") {
            mostrarIniciativaRestringida(iniciativa);
        } else {
            mostrarDetalle(iniciativa);
        }


    } catch (error) {

        // Muestra el error en la consola.
        console.error(
            "Error al cargar el detalle:",
            error
        );

        // Mensaje visible al usuario.
        mostrarError(
            "No fue posible cargar la información de la iniciativa."
        );
    }
}


/* Muestra toda la información de una iniciativa que puede ser consultada por el usuario */
function mostrarDetalle(iniciativa) {

    detalleIniciativa.innerHTML = `

        <!-- Encabezado de la iniciativa -->
        <section class="mb-4">

            <!-- 
            badge: muestra el contenido como una etiqueta.
            text-bg-primary: aplica el color principal al fondo
            y ajusta el color del texto para que tenga buen contraste. -->
            <p class="mb-2">
                <span class="badge text-bg-primary">
                    ${iniciativa.tipo}
                </span>

                <span class="badge text-bg-secondary">
                    ${iniciativa.estado}
                </span>
            </p>

            <h1 id="titulo-iniciativa" class="mb-3">
                ${iniciativa.titulo}
            </h1>

            <p class="lead">
                ${iniciativa.resumen}
            </p>

        </section>


        <!-- Información general -->
        <section class="card mb-4">

            <div class="card-body">

                <h2 class="h4 card-title mb-3">
                    Información general
                </h2>

                <p>
                    <strong>Publicado por:</strong>
                    ${iniciativa.propietario}
                </p>

                <p>
                    <strong>Categoría:</strong>
                    ${iniciativa.categoria}
                </p>

                <p>
                    <strong>Visibilidad:</strong>
                    ${iniciativa.visibilidad}
                </p>

                <p class="mb-0">
                    <strong>Estado:</strong>
                    ${iniciativa.estado}
                </p>

            </div>

        </section>


        <!-- Descripción -->
        <section class="card mb-4">

            <div class="card-body">

                <h2 class="h4 card-title">
                    Descripción
                </h2>

                <p class="card-text">
                    ${iniciativa.descripcion}
                </p>

            </div>

        </section>


        <!-- Problema y beneficiarios -->
        <section class="row g-4 mb-4">

            <div class="col-12 col-md-6">

                <div class="card h-100">

                    <div class="card-body">

                        <h2 class="h4 card-title">
                            Problema identificado
                        </h2>

                        <p class="card-text">
                            ${iniciativa.problema}
                        </p>

                    </div>

                </div>

            </div>


            <div class="col-12 col-md-6">

                <div class="card h-100">

                    <div class="card-body">

                        <h2 class="h4 card-title">
                            Beneficiarios
                        </h2>

                        <p class="card-text">
                            ${iniciativa.beneficiarios}
                        </p>

                    </div>

                </div>

            </div>

        </section>


        <!-- Competencias requeridas -->
        <section class="card mb-4">

            <div class="card-body">

                <h2 class="h4 card-title">
                    Competencias requeridas
                </h2>

                <p class="card-text">
                    ${iniciativa.competencias.join(", ")}
                </p>

            </div>

        </section>


        <!-- Equipo -->
        <section class="card mb-4">

            <div class="card-body">

                <h2 class="h4 card-title">
                    Equipo
                </h2>

                <p>
                    <strong>Miembros:</strong>
                    ${iniciativa.miembros.length}
                    de
                    ${iniciativa.miembrosEstimados}
                </p>

                <p class="mb-0">
                    <strong>Integrantes:</strong>
                    ${iniciativa.miembros.join(", ")}
                </p>

            </div>

        </section>


        <!-- Acción de participación -->
        <section class="mb-4">

            <a
                href="solicitudes.html?id=${iniciativa.id}"
                class="btn btn-primary"
            >
                Solicitar participación
            </a>

        </section>

    `;

}


/* Información con visibilidad restringida */
function mostrarIniciativaRestringida(iniciativa) {

    detalleIniciativa.innerHTML = `

        <!-- Información disponible -->
        <section class="mb-4">

            <p class="mb-2">
                <span class="badge text-bg-primary">
                    ${iniciativa.tipo}
                </span>

                <span class="badge text-bg-warning">
                    Restringida
                </span>
            </p>

            <h1 id="titulo-iniciativa" class="mb-3">
                ${iniciativa.titulo}
            </h1>

            <p class="lead">
                ${iniciativa.resumen}
            </p>

        </section>


        <!-- Aviso de contenido restringido -->
        <section>

            <div class="alert alert-warning" role="alert" >

                El contenido completo de esta iniciativa
                no está disponible debido a su nivel
                de visibilidad.

            </div>
        </section>
    `;
}


/* Muestra un mensaje cuando ocurre un error o no se encuentra la iniciativa */
function mostrarError(mensaje) {

    detalleIniciativa.innerHTML = `

        <div class="alert alert-danger" role="alert">
            ${mensaje}
        </div>
    `;
}


// Carga el detalle al abrir la página.
cargarDetalle();