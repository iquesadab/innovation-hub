import { useState } from "react"; // Permite controlar los campos del formulario.
import { convertirEnProyecto } from "../../servicios/proyectos.api.js"; // Envía la conversión al servidor.

function ConvertirProyecto({ token, iniciativaId, alConvertir }) {

    // Guarda los datos escritos en el formulario.
    const [datos, setDatos] = useState({
        objetivo: "",
        fechaInicio: "",
        repositorioGitHub: ""
    });

    // Guarda los mensajes de error y controla el envío.
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Actualiza el campo que el usuario modifica.
    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setDatos((actuales) => ({
            ...actuales,
            [name]: value
        }));
    }

    // Envía la información al servidor.
    async function manejarEnvio(evento) {
        evento.preventDefault();
        setError("");

        // Comprueba los campos obligatorios.
        if (datos.objetivo.trim().length < 10 || !datos.fechaInicio) {
            setError("Complete el objetivo y la fecha de inicio.");
            return;
        }

        setEnviando(true);

        try {
            // Solicita la conversión de la iniciativa.
            const proyecto = await convertirEnProyecto(
                token,
                iniciativaId,
                datos
            );

            // Avisa al componente principal que terminó correctamente.
            alConvertir(proyecto);

        } catch (error) {
            // Muestra el mensaje si el servidor rechaza la conversión.
            setError(error.message);

        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="card mt-4">
            <div className="card-body">

                <h2 className="h5">Convertir iniciativa en proyecto</h2>

                {/* Muestra los errores del formulario o del servidor. */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio} noValidate>

                    {/* Objetivo principal del proyecto. */}
                    <div className="mb-3">
                        <label htmlFor="objetivoProyecto" className="form-label">
                            Objetivo
                        </label>
                        <textarea
                            id="objetivoProyecto"
                            name="objetivo"
                            className="form-control"
                            value={datos.objetivo}
                            onChange={manejarCambio}
                            rows="3"
                        />
                    </div>

                    {/* Fecha en que comienza el proyecto. */}
                    <div className="mb-3">
                        <label htmlFor="fechaProyecto" className="form-label">
                            Fecha de inicio
                        </label>
                        <input
                            id="fechaProyecto"
                            name="fechaInicio"
                            type="date"
                            className="form-control"
                            value={datos.fechaInicio}
                            onChange={manejarCambio}
                        />
                    </div>

                    {/* Repositorio opcional de GitHub. */}
                    <div className="mb-3">
                        <label htmlFor="githubProyecto" className="form-label">
                            Repositorio de GitHub (opcional)
                        </label>
                        <input
                            id="githubProyecto"
                            name="repositorioGitHub"
                            type="url"
                            className="form-control"
                            placeholder="https://github.com/usuario/repositorio"
                            value={datos.repositorioGitHub}
                            onChange={manejarCambio}
                        />
                    </div>

                    {/* Envía los datos para crear el proyecto. */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={enviando}
                    >
                        {enviando ? "Convirtiendo..." : "Convertir en proyecto"}
                    </button>

                </form>
            </div>
        </section>
    );
}

export default ConvertirProyecto;