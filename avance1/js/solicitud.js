// Obtiene los elementos necesarios del DOM.
const formularioSolicitud = document.getElementById("form-solicitud");
const mensaje = document.getElementById("mensaje");
const competencia = document.getElementById("competencia");
const rol = document.getElementById("rol");
const disponibilidad = document.getElementById("disponibilidad");
const mensajeSolicitud = document.getElementById("mensaje-solicitud");
// Obtiene el id de la iniciativa enviado desde Detalle.
const parametros = new URLSearchParams(window.location.search);
const idIniciativa = Number(parametros.get("id"));


// Muestra el error de un campo.
function mostrarError(campo, idError, mensajeError) {

    campo.classList.add("is-invalid");

    document.getElementById(idError).textContent = mensajeError;

}


// Quita el error de un campo.
function quitarError(campo, idError) {

    campo.classList.remove("is-invalid");

    document.getElementById(idError).textContent = "";

}
// Carga la iniciativa seleccionada.
async function cargarIniciativa() {

    try {

        // Obtiene las iniciativas del JSON.
        const respuesta = await fetch("../datos/iniciativas.json");
        const iniciativas = await respuesta.json();

        // Busca la iniciativa por su id.
        let iniciativa = iniciativas.find(function (iniciativa) {
            return iniciativa.id === idIniciativa;
        });

        // Si no está en el JSON, la busca entre las iniciativas locales.
        if (!iniciativa) {

            const iniciativasLocales = JSON.parse(localStorage.getItem("iniciativasLocales")) || [];

            iniciativa = iniciativasLocales.find(function (iniciativa) {
                return iniciativa.id === idIniciativa;
            });
        }

        // Verifica que la iniciativa exista.
        if (!iniciativa) {

            document.getElementById("titulo-iniciativa").textContent = "Iniciativa no encontrada";
            return;
        }

        // Muestra el título de la iniciativa seleccionada.
        document.getElementById("titulo-iniciativa").textContent = iniciativa.titulo;

    } catch (error) {

        document.getElementById("titulo-iniciativa").textContent = "No se pudo cargar la iniciativa";
    }
}

// Valida los campos de la solicitud.
function validarFormulario() {

    let formularioValido = true;


    // Valida el mensaje de presentación.
    if (mensaje.value.trim() === "") {

        mostrarError(
            mensaje,
            "error-mensaje",
            "El mensaje de presentación es obligatorio."
        );

        formularioValido = false;

    } else {

        quitarError(mensaje, "error-mensaje");

    }


    // Valida la competencia principal.
    if (competencia.value === "") {

        mostrarError(
            competencia,
            "error-competencia",
            "Debe seleccionar una competencia."
        );

        formularioValido = false;

    } else {

        quitarError(competencia, "error-competencia");

    }


    // Valida el rol deseado.
    if (rol.value === "") {

        mostrarError(
            rol,
            "error-rol",
            "Debe seleccionar un rol."
        );

        formularioValido = false;

    } else {

        quitarError(rol, "error-rol");

    }


    // Valida la disponibilidad.
    if (disponibilidad.value.trim() === "") {

        mostrarError(
            disponibilidad,
            "error-disponibilidad",
            "Debe indicar su disponibilidad."
        );

        formularioValido = false;

    } else {

        quitarError(disponibilidad, "error-disponibilidad");

    }

    return formularioValido;

}


// Detecta el envío del formulario.
formularioSolicitud.addEventListener("submit", function (evento) {

    // Evita que el formulario recargue la página.
    evento.preventDefault();


    // Detiene el envío si existen errores.
    if (!validarFormulario()) {

        mensajeSolicitud.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Revise los campos marcados antes de enviar la solicitud.
            </div>
        `;

        return;

    }


    // Simula el envío de la solicitud.
    mensajeSolicitud.innerHTML = `
        <div class="alert alert-success" role="alert">
            Solicitud enviada correctamente.
        </div>
    `;


 // Limpia el formulario.
formularioSolicitud.reset();

});

// Carga la iniciativa al abrir la página.
cargarIniciativa();