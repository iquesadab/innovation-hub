// Datos de ejemplo del usuario.
const usuario = {

    nombre: "Andrea Rodríguez",
    correo: "arodriguez@ucenfotec.ac.cr",
    carrera: "Ingeniería del Software",

    competencias: [
        "JavaScript",
        "HTML",
        "CSS",
        "Trabajo en equipo"
    ],

    intereses: [
        "Educación",
        "Tecnología",
        "Innovación",
        "Gestión comunitaria"
    ],

    proyectos: [
        {
            titulo: "Tutorías entre estudiantes",
            rol: "Desarrolladora",
            estado: "En progreso"
        },
        {
            titulo: "Reciclaje inteligente",
            rol: "Colaboradora",
            estado: "Pendiente"
        }
    ]

};


// Obtiene los elementos necesarios del DOM.
const nombreUsuario = document.getElementById("nombre-usuario");
const carreraUsuario = document.getElementById("carrera-usuario");
const correoUsuario = document.getElementById("correo-usuario");
const detalleCarrera = document.getElementById("detalle-carrera");
const listaCompetenciasPerfil = document.getElementById("lista-competencias-perfil");
const listaIntereses = document.getElementById("lista-intereses");
const listaProyectos = document.getElementById("lista-proyectos");


// Muestra la información personal.
function mostrarInformacionPersonal() {

    nombreUsuario.textContent = usuario.nombre;
    carreraUsuario.textContent = usuario.carrera;
    correoUsuario.textContent = usuario.correo;
    detalleCarrera.textContent = usuario.carrera;

}


// Muestra las competencias.
function mostrarCompetenciasPerfil() {

    usuario.competencias.forEach(function(competencia) {

        const elemento = document.createElement("span");
        // badge text-bg-primary: aplica el estilo de insignia de Bootstrap con el color primario.
        elemento.className = "badge text-bg-primary";
        elemento.textContent = competencia;

        listaCompetenciasPerfil.appendChild(elemento);

    });

}


// Muestra los intereses.
function mostrarIntereses() {

    usuario.intereses.forEach(function(interes) {

        const elemento = document.createElement("span");

        elemento.className = "badge text-bg-secondary";
        elemento.textContent = interes;

        listaIntereses.appendChild(elemento);

    });

}


// Muestra los proyectos del usuario.
function mostrarProyectos() {

    if (usuario.proyectos.length === 0) {

        listaProyectos.innerHTML = `
            <div class="col-12">
                <p>No participa en ningún proyecto actualmente.</p>
            </div>
        `;

        return;

    }


    usuario.proyectos.forEach(function(proyecto) {

        const columna = document.createElement("div");

        columna.className = "col-12 col-md-6";

        columna.innerHTML = `
            <article class="card h-100">
                <div class="card-body">
                    <h3 class="card-title h5">${proyecto.titulo}</h3>
                    <p class="card-text"><strong>Rol:</strong> ${proyecto.rol}</p>
                    <p class="card-text"><strong>Estado:</strong> ${proyecto.estado}</p>
                </div>
            </article>
        `;

        listaProyectos.appendChild(columna);

    });

}


// Carga la información del perfil.
mostrarInformacionPersonal();
mostrarCompetenciasPerfil();
mostrarIntereses();
mostrarProyectos();