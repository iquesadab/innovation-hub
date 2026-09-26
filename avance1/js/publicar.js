// Obtiene los elementos necesarios del DOM.
const formulario = document.getElementById("form-publicar");
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoria");
const mensajeFormulario = document.getElementById("mensaje-formulario");


// Carga los tipos desde el JSON.
async function cargarTipos() {

    try {

        const respuesta = await fetch("../datos/tipos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los tipos.");
        }

        const tipos = await respuesta.json();

        tipos.forEach(function(tipoIniciativa) {

            const opcion = document.createElement("option");
            opcion.value = tipoIniciativa;
            opcion.textContent = tipoIniciativa;
            tipo.appendChild(opcion);

        });

    } catch (error) {

        console.error("Error al cargar los tipos:", error);

    }

}


// Carga las categorías desde el JSON.
async function cargarCategorias() {

    try {

        const respuesta = await fetch("../datos/categorias.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las categorías.");
        }

        const categorias = await respuesta.json();

        categorias.forEach(function(categoriaIniciativa) {

            const opcion = document.createElement("option");
            opcion.value = categoriaIniciativa;
            opcion.textContent = categoriaIniciativa;
            categoria.appendChild(opcion);

        });

    } catch (error) {

        console.error("Error al cargar las categorías:", error);

    }

}

// Valida los campos del formulario.
function validarFormulario() {

    // Obtiene los campos que deben validarse.
    const titulo = document.getElementById("titulo");
    const resumen = document.getElementById("resumen");
    const descripcion = document.getElementById("descripcion");
    const problema = document.getElementById("problema");
    const beneficiarios = document.getElementById("beneficiarios");
    const miembrosEstimados = document.getElementById("miembros-estimados");
    const competencias = document.getElementById("competencias");
    const visibilidad = document.getElementById("visibilidad");

    // Guarda todos los campos obligatorios en un arreglo.
    const camposObligatorios = [
        titulo,
        tipo,
        categoria,
        resumen,
        descripcion,
        problema,
        beneficiarios,
        miembrosEstimados,
        competencias,
        visibilidad
    ];

    // Indica si el formulario es válido.
    let formularioValido = true;

    // Revisa cada campo obligatorio.
    camposObligatorios.forEach(function(campo) {

        // Elimina la marca de error anterior.
        campo.classList.remove("is-invalid");

        // Verifica si el campo está vacío.
        if (campo.value.trim() === "") {

            // Marca el campo como inválido con Bootstrap.
            campo.classList.add("is-invalid");

            formularioValido = false;
        }

    });

    // Verifica que la cantidad de miembros sea mayor a 0.
    if (miembrosEstimados.value !== "" && Number(miembrosEstimados.value) < 1) {

        miembrosEstimados.classList.add("is-invalid");

        formularioValido = false;
    }

    // Si existe algún error, muestra el mensaje.
    if (!formularioValido) {

        mostrarMensaje(
            "Revise los campos marcados antes de publicar.",
            "danger"
        );

        return false;
    }

    // Si no encontró errores, el formulario es válido.
    return true;
}


// Muestra mensajes de error o éxito.
function mostrarMensaje(mensaje, tipoMensaje) {

    mensajeFormulario.innerHTML = `
        <div class="alert alert-${tipoMensaje}" role="alert">${mensaje}</div>
    `;

}


// Detecta el envío del formulario.
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    mostrarMensaje("Iniciativa publicada correctamente.", "success");

    formulario.reset();

});


// Carga los datos necesarios.
cargarTipos();
cargarCategorias();