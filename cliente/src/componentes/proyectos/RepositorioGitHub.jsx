import { useEffect, useState } from "react";

function RepositorioGitHub({ url }) {

    // Guarda la información recibida desde GitHub.
    const [repositorio, setRepositorio] = useState(null);

    // Controla el mensaje de carga.
    const [cargando, setCargando] = useState(true);

    // Guarda los mensajes de error.
    const [error, setError] = useState("");

    // Consulta GitHub cuando cambia la URL del repositorio.
    useEffect(() => {

        // Permite cancelar la petición si se cierra el componente.
        const controlador = new AbortController();

        async function consultarRepositorio() {

            setCargando(true);
            setError("");
            setRepositorio(null);

            try {
                // Separa el propietario y el nombre del repositorio.
                const direccion = new URL(url);
                const partes = direccion.pathname
                    .split("/")
                    .filter(Boolean);

                // Comprueba que la dirección sea de GitHub.
                if (
                    direccion.hostname !== "github.com" ||
                    partes.length !== 2
                ) {
                    throw new Error(
                        "La dirección del repositorio no es válida."
                    );
                }

                // Consulta los datos del repositorio en GitHub.
                const respuesta = await fetch(
                    `https://api.github.com/repos/${partes[0]}/${partes[1]}`,
                    { signal: controlador.signal }
                );

                // GitHub responde 404 si no encuentra el repositorio.
                if (respuesta.status === 404) {
                    throw new Error(
                        "El repositorio no existe o es privado."
                    );
                }

                // Controla los límites de consultas de GitHub.
                if (
                    respuesta.status === 403 ||
                    respuesta.status === 429
                ) {
                    throw new Error(
                        "Se alcanzó el límite de consultas de GitHub."
                    );
                }

                // Controla otros errores del servicio.
                if (!respuesta.ok) {
                    throw new Error(
                        "El servicio de GitHub no está disponible."
                    );
                }

                const datos = await respuesta.json();

                // Comprueba que la respuesta tenga datos importantes.
                if (!datos || !datos.full_name || !datos.owner) {
                    throw new Error(
                        "GitHub devolvió información inválida."
                    );
                }

                // Guarda los datos para mostrarlos en pantalla.
                setRepositorio(datos);

            } catch (error) {
                // No muestra error cuando la consulta fue cancelada.
                if (error.name !== "AbortError") {
                    setError(error.message);
                }

            } finally {
                // Finaliza la carga si la consulta sigue activa.
                if (!controlador.signal.aborted) {
                    setCargando(false);
                }
            }
        }

        consultarRepositorio();

        // Cancela la petición al salir del componente.
        return () => controlador.abort();

    }, [url]);

    return (
        <section className="card mt-4">
            <div className="card-body">

                <h3 className="h5">Repositorio de GitHub</h3>

                {/* Mensaje mientras se consulta GitHub. */}
                {cargando && (
                    <p role="status">Consultando GitHub...</p>
                )}

                {/* Muestra el error si falla la consulta. */}
                {error && (
                    <div className="alert alert-warning" role="alert">
                        {error}
                    </div>
                )}

                {/* Muestra los datos cuando la consulta termina correctamente. */}
                {!cargando && !error && repositorio && (
                    <div>
                        <p><strong>Nombre:</strong> {repositorio.name}</p>
                        <p><strong>Propietario:</strong> {repositorio.owner.login}</p>
                        <p><strong>Descripción:</strong> {repositorio.description || "Sin descripción"}</p>
                        <p><strong>Lenguaje:</strong> {repositorio.language || "No indicado"}</p>
                        <p><strong>Rama principal:</strong> {repositorio.default_branch}</p>
                        <p><strong>Última actualización:</strong> {new Date(repositorio.updated_at).toLocaleDateString("es-CR")}</p>
                        <p><strong>Asuntos abiertos:</strong> {repositorio.open_issues_count}</p>

                        {/* Abre el repositorio en otra pestaña. */}
                        <a
                            href={repositorio.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary"
                        >
                            Ver repositorio
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

export default RepositorioGitHub;
