import { useState } from "react";

// Componente que permite crear o editar una solicitud.
// Recibe los datos iniciales, una función para guardar
// y un indicador para saber si se está guardando.
function FormularioSolicitud({
    inicial = {},
    alGuardar,
    guardando = false
}) {

    // Guarda el motivo por el que el usuario quiere participar.
    // Si estamos editando, muestra el motivo anterior.
    const [motivo, setMotivo] = useState(inicial.motivo || "");

    // Guarda la experiencia del usuario.
    // Este campo es opcional.
    const [experiencia, setExperiencia] = useState(
        inicial.experiencia || ""
    );

    // Guarda el tiempo disponible para colaborar.
    const [disponibilidad, setDisponibilidad] = useState(
        inicial.disponibilidad || ""
    );

    // Guarda las competencias como un texto separado por comas.
    // Si estamos editando, convierte la lista anterior en texto.
    const [competencias, setCompetencias] = useState(
        Array.isArray(inicial.competencias)
            ? inicial.competencias.join(", ")
            : ""
    );

    // Guarda los mensajes de error del formulario.
    const [error, setError] = useState("");


    // Se ejecuta cuando el usuario presiona "Guardar solicitud".
    function manejarEnvio(evento) {

        // Evita que el navegador recargue la página.
        evento.preventDefault();

        // Limpia cualquier error anterior.
        setError("");

        // Elimina espacios innecesarios al inicio y al final.
        const motivoLimpio = motivo.trim();
        const experienciaLimpia = experiencia.trim();
        const disponibilidadLimpia = disponibilidad.trim();

        // Convierte las competencias escritas en una lista.
        // Ejemplo: "React, JavaScript" pasa a ["React", "JavaScript"].
        const listaCompetencias = competencias
            .split(",")
            .map((valor) => valor.trim())
            .filter((valor) => valor !== "");


        // VALIDACIÓN 1: comprueba la longitud del motivo.
        // El backend exige entre 10 y 1000 caracteres.
        if (
            motivoLimpio.length < 10 ||
            motivoLimpio.length > 1000
        ) {
            setError(
                "El motivo debe tener entre 10 y 1000 caracteres."
            );
            return;
        }


        // VALIDACIÓN 2: comprueba la experiencia.
        // Es opcional, pero no puede superar 1000 caracteres.
        if (experienciaLimpia.length > 1000) {
            setError(
                "La experiencia no puede superar 1000 caracteres."
            );
            return;
        }


        // VALIDACIÓN 3: comprueba la disponibilidad.
        // El backend exige entre 3 y 200 caracteres.
        if (
            disponibilidadLimpia.length < 3 ||
            disponibilidadLimpia.length > 200
        ) {
            setError(
                "La disponibilidad debe tener entre 3 y 200 caracteres."
            );
            return;
        }


        // VALIDACIÓN 4: comprueba la cantidad de competencias.
        // El backend permite como máximo 20 competencias.
        if (listaCompetencias.length > 20) {
            setError(
                "Puede ingresar un máximo de 20 competencias."
            );
            return;
        }


        // VALIDACIÓN 5: comprueba la longitud de cada competencia.
        // Cada una debe tener entre 2 y 50 caracteres.
        const competenciaInvalida = listaCompetencias.some(
            (valor) => valor.length < 2 || valor.length > 50
        );

        if (competenciaInvalida) {
            setError(
                "Cada competencia debe tener entre 2 y 50 caracteres."
            );
            return;
        }


        // VALIDACIÓN 6: comprueba que no existan competencias repetidas.
        // Convierte los textos a minúsculas para poder compararlos.
        const competenciasUnicas = new Set(
            listaCompetencias.map((valor) => valor.toLowerCase())
        );

        // Si hay menos elementos únicos, significa que alguno se repitió.
        if (competenciasUnicas.size !== listaCompetencias.length) {
            setError("No puede repetir competencias.");
            return;
        }


        // Prepara los datos que necesita el backend.
        const datosSolicitud = {
            motivo: motivoLimpio,
            experiencia: experienciaLimpia,
            disponibilidad: disponibilidadLimpia,
            competencias: listaCompetencias
        };

        // Envía los datos al componente que utiliza este formulario.
        // Ese componente se encargará de llamar al backend.
        alGuardar(datosSolicitud);
    }


    return (
        <form onSubmit={manejarEnvio} noValidate>

            {/* Muestra un mensaje si alguna validación falla. */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}


            {/* Campo obligatorio: motivo de participación. */}
            <div className="mb-3">

                <label
                    htmlFor="solicitudMotivo"
                    className="form-label"
                >
                    ¿Por qué desea participar? *
                </label>

                <textarea
                    id="solicitudMotivo"
                    className="form-control"
                    rows="4"
                    maxLength={1000}
                    value={motivo}
                    onChange={(evento) =>
                        setMotivo(evento.target.value)
                    }
                />

                <div className="form-text">
                    Explique qué le interesa de esta iniciativa.
                </div>
            </div>


            {/* Campo opcional: experiencia del usuario. */}
            <div className="mb-3">

                <label
                    htmlFor="solicitudExperiencia"
                    className="form-label"
                >
                    Experiencia
                </label>

                <textarea
                    id="solicitudExperiencia"
                    className="form-control"
                    rows="3"
                    maxLength={1000}
                    value={experiencia}
                    onChange={(evento) =>
                        setExperiencia(evento.target.value)
                    }
                />

                <div className="form-text">
                    Puede mencionar proyectos o conocimientos anteriores.
                </div>
            </div>


            {/* Campo obligatorio: disponibilidad para colaborar. */}
            <div className="mb-3">

                <label
                    htmlFor="solicitudDisponibilidad"
                    className="form-label"
                >
                    Disponibilidad *
                </label>

                <input
                    id="solicitudDisponibilidad"
                    type="text"
                    className="form-control"
                    maxLength={200}
                    placeholder="Ejemplo: 6 horas semanales"
                    value={disponibilidad}
                    onChange={(evento) =>
                        setDisponibilidad(evento.target.value)
                    }
                />

                <div className="form-text">
                    Indique cuánto tiempo puede dedicar a la iniciativa.
                </div>
            </div>


            {/* Campo opcional: competencias del usuario. */}
            <div className="mb-4">

                <label
                    htmlFor="solicitudCompetencias"
                    className="form-label"
                >
                    Competencias
                </label>

                <input
                    id="solicitudCompetencias"
                    type="text"
                    className="form-control"
                    placeholder="Ejemplo: React, JavaScript, Diseño UX"
                    value={competencias}
                    onChange={(evento) =>
                        setCompetencias(evento.target.value)
                    }
                />

                <div className="form-text">
                    Separe cada competencia con una coma.
                </div>
            </div>


            {/* Botón que ejecuta la función manejarEnvio. */}
            <button
                type="submit"
                className="btn btn-primary"
                disabled={guardando}
            >
                {/* Cambia el texto mientras se guarda la solicitud. */}
                {guardando
                    ? "Guardando..."
                    : "Guardar solicitud"}
            </button>

        </form>
    );
}

// Permite utilizar el formulario en otras páginas.
export default FormularioSolicitud;