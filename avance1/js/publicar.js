// Obtiene los elementos necesarios del DOM.
const formulario = document.getElementById("form-publicar");
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoria");
const mensajeFormulario = document.getElementById("mensaje-formulario");
const campoCompetencia = document.getElementById("competencia");
const botonAgregarCompetencia = document.getElementById("btn-agregar-competencia");
const listaCompetencias = document.getElementById("lista-competencias");
// Obtiene el id si se está modificando una iniciativa.
const parametros = new URLSearchParams(window.location.search);
const idEditar = Number(parametros.get("id"));

let competencias = [];


// Carga los tipos desde el JSON.
async function cargarTipos() {

    try {

        const respuesta = await fetch("../datos/tipos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los tipos.");
        }

        const tipos = await respuesta.json();

        tipos.forEach(function (tipoIniciativa) {

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

        categorias.forEach(function (categoriaIniciativa) {

            const opcion = document.createElement("option");
            opcion.value = categoriaIniciativa;
            opcion.textContent = categoriaIniciativa;
            categoria.appendChild(opcion);

        });

    } catch (error) {

        console.error("Error al cargar las categorías:", error);

    }

}

// Muestra las competencias agregadas.
function mostrarCompetencias() {

    listaCompetencias.innerHTML = "";

    competencias.forEach(function (competencia, indice) {

        const elemento = document.createElement("div");

        elemento.className = "d-flex justify-content-between align-items-center border rounded p-2 mb-2";

        elemento.innerHTML = `
            <span>${competencia}</span>
            <button type="button" class="btn btn-sm btn-outline-danger" data-indice="${indice}">Eliminar</button>
        `;

        listaCompetencias.appendChild(elemento);

    });

}

// Agrega una competencia.
function agregarCompetencia() {

    const nuevaCompetencia = campoCompetencia.value.trim();

    if (nuevaCompetencia === "") {
        campoCompetencia.classList.add("is-invalid");
        return;
    }

    campoCompetencia.classList.remove("is-invalid");

    competencias.push(nuevaCompetencia);

    campoCompetencia.value = "";

    mostrarCompetencias();

}

// Detecta el botón para agregar una competencia.
botonAgregarCompetencia.addEventListener("click", function () {

    agregarCompetencia();

});

// Detecta los botones para eliminar competencias.
listaCompetencias.addEventListener("click", function (evento) {

    // evento.target: representa el elemento exacto donde hizo clic el usuario
    if (evento.target.tagName === "BUTTON") {

        const indice = evento.target.dataset.indice;

        // competencias.splice(indice, 1): elimina un elemento del arreglo en la posición indicada
        competencias.splice(indice, 1);

        mostrarCompetencias();

    }

});

// Marca un campo y muestra su mensaje de error.
function mostrarError(campo, mensaje) {

    campo.classList.add("is-invalid");

    let error = campo.parentElement.querySelector(".invalid-feedback");

    if (!error) {

        error = document.createElement("div");
        error.className = "invalid-feedback";
        campo.parentElement.appendChild(error);

    }

    error.textContent = mensaje;

}

// Quita el error de un campo.
function quitarError(campo) {

    campo.classList.remove("is-invalid");

    const error = campo.parentElement.querySelector(".invalid-feedback");

    if (error) {
        error.remove();
    }

}

// Valida los campos del formulario.
function validarFormulario() {

    const titulo = document.getElementById("titulo");
    const resumen = document.getElementById("resumen");
    const descripcion = document.getElementById("descripcion");
    const problema = document.getElementById("problema");
    const beneficiarios = document.getElementById("beneficiarios");
    const miembrosEstimados = document.getElementById("miembros-estimados");
    const etiquetas = document.getElementById("etiquetas");
    const visibilidad = document.getElementById("visibilidad");

    let formularioValido = true;

    // Limpia los errores anteriores.
    [titulo, tipo, categoria, resumen, descripcion, problema, beneficiarios, miembrosEstimados, visibilidad, etiquetas, campoCompetencia].forEach(function (campo) {
        quitarError(campo);
    });

    if (titulo.value.trim() === "") {

        mostrarError(titulo, "El título es obligatorio.");
        formularioValido = false;
    }

    if (tipo.value === "") {

        mostrarError(tipo, "Debe seleccionar un tipo.");
        formularioValido = false;
    }

    if (categoria.value === "") {

        mostrarError(categoria, "Debe seleccionar una categoría.");
        formularioValido = false;
    }

    if (resumen.value.trim() === "") {

        mostrarError(resumen, "El resumen es obligatorio.");
        formularioValido = false;
    }

    if (descripcion.value.trim() === "") {

        mostrarError(descripcion, "La descripción es obligatoria.");
        formularioValido = false;
    }

    if (problema.value.trim() === "") {

        mostrarError(problema, "Debe indicar el problema identificado.");
        formularioValido = false;
    }

    if (beneficiarios.value.trim() === "") {

        mostrarError(beneficiarios, "Debe indicar los beneficiarios.");
        formularioValido = false;
    }

    if (miembrosEstimados.value === "") {

        mostrarError(miembrosEstimados, "Debe indicar la cantidad estimada de miembros.");
        formularioValido = false;

    } else if (Number(miembrosEstimados.value) < 1) {

        mostrarError(miembrosEstimados, "La cantidad de miembros debe ser mayor a 0.");
        formularioValido = false;
    }

    if (competencias.length === 0) {

        mostrarError(campoCompetencia, "Debe agregar al menos una competencia.");
        formularioValido = false;
    }

    if (etiquetas.value.trim() === "") {

        mostrarError(etiquetas, "Debe agregar al menos una etiqueta.");
        formularioValido = false;
    }

    if (visibilidad.value === "") {

        mostrarError(visibilidad, "Debe seleccionar la visibilidad.");
        formularioValido = false;
    }

    if (!formularioValido) {

        mostrarMensaje("Revise los campos marcados antes de publicar.", "danger");
        return false;
    }
    return true;
}


// Muestra mensajes de error o éxito.
function mostrarMensaje(mensaje, tipoMensaje) {

    mensajeFormulario.innerHTML = `
        <div class="alert alert-${tipoMensaje}" role="alert">${mensaje}</div>
    `;

}

// Carga los datos de la iniciativa que se va a modificar.
function cargarIniciativaEditar() {

    if (!idEditar) {
        return;
    }

    const iniciativasLocales = JSON.parse(localStorage.getItem("iniciativasLocales")) || [];

    const iniciativa = iniciativasLocales.find(function (iniciativa) {
        return iniciativa.id === idEditar;
    });

    if (!iniciativa) {
        mostrarMensaje("No se encontró la iniciativa.", "danger");
        return;
    }

    document.getElementById("titulo").value = iniciativa.titulo;
    tipo.value = iniciativa.tipo;
    categoria.value = iniciativa.categoria;
    document.getElementById("resumen").value = iniciativa.resumen;
    document.getElementById("descripcion").value = iniciativa.descripcion;
    document.getElementById("problema").value = iniciativa.problema;
    document.getElementById("beneficiarios").value = iniciativa.beneficiarios;
    document.getElementById("miembros-estimados").value = iniciativa.miembrosEstimados;
    document.getElementById("visibilidad").value = iniciativa.visibilidad;
    document.getElementById("etiquetas").value = iniciativa.etiquetas.join(", ");

    competencias = [...iniciativa.competencias];

    mostrarCompetencias();

}

// Detecta el envío del formulario.
formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const datosIniciativa = {
        titulo: document.getElementById("titulo").value.trim(),
        tipo: tipo.value,
        categoria: categoria.value,
        resumen: document.getElementById("resumen").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        problema: document.getElementById("problema").value.trim(),
        beneficiarios: document.getElementById("beneficiarios").value.trim(),
        competencias: competencias,
        miembrosEstimados: Number(document.getElementById("miembros-estimados").value),
        visibilidad: document.getElementById("visibilidad").value,
        etiquetas: document.getElementById("etiquetas").value.split(",").map(function (etiqueta) {
            return etiqueta.trim();
        }),
        propietario: "Usuario actual",
        estado: "Pendiente",
        miembros: []
    };

    const iniciativasLocales = JSON.parse(localStorage.getItem("iniciativasLocales")) || [];

    // Modifica una iniciativa existente.
    if (idEditar) {

        const indice = iniciativasLocales.findIndex(function (iniciativa) {
            return iniciativa.id === idEditar;
        });

        if (indice === -1) {
            mostrarMensaje("No se encontró la iniciativa.", "danger");
            return;
        }

        iniciativasLocales[indice] = {
            ...iniciativasLocales[indice],
            ...datosIniciativa
        };

        // Guarda las modificaciones.
        localStorage.setItem("iniciativasLocales", JSON.stringify(iniciativasLocales));

        // Redirige al catálogo después de modificar.
        window.location.href = "catalogo.html";

        return;
    }

    // Registra una nueva iniciativa.
    const nuevaIniciativa = {
        id: Date.now(),
        ...datosIniciativa
    };

    iniciativasLocales.push(nuevaIniciativa);

    localStorage.setItem("iniciativasLocales", JSON.stringify(iniciativasLocales));

    mostrarMensaje("Iniciativa publicada correctamente.", "success");

    formulario.reset();

    competencias = [];

    mostrarCompetencias();
});


// Carga los datos necesarios antes de editar.
async function iniciarPagina() {

    await cargarTipos();
    await cargarCategorias();

    cargarIniciativaEditar();
}

iniciarPagina();