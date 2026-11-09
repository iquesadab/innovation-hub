import { useEffect, useState } from "react";

// Importa las funciones que consultan los proyectos en el servidor.
import {
    obtenerProyectos,
    obtenerDetalleProyecto
} from "../servicios/proyectos.api.js";

// Importa el componente que muestra los datos de GitHub.
import RepositorioGitHub from "../componentes/proyectos/RepositorioGitHub.jsx";

function Proyectos({ token }) {

    // Guarda la lista de proyectos.
    const [proyectos, setProyectos] = useState([]);

    // Guarda el proyecto seleccionado.
    const [proyecto, setProyecto] = useState(null);

    // Controla el estado de carga de la lista.
    const [cargando, setCargando] = useState(true);

    // Guarda los mensajes de error.
    const [error, setError] = useState("");

    // Controla la carga del detalle.
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    // Consulta los proyectos cuando se abre la página.
    useEffect(() => {

        const controlador = new AbortController();

        async function cargarProyectos() {

            try {
                setCargando(true);
                setError("");

                // Solicita al servidor los proyectos del usuario.
                const resultado = await obtenerProyectos(token);

                // Comprueba que el resultado sea una lista.
                if (!controlador.signal.aborted) {
                    setProyectos(
                        Array.isArray(resultado) ? resultado : []
                    );
                }

            } catch (error) {
                // Guarda el mensaje si ocurre un error.
                if (!controlador.signal.aborted) {
                    setError(error.message);
                }

            } finally {
                // Finaliza el estado de carga.
                if (!controlador.signal.aborted) {
                    setCargando(false);
                }
            }
        }

        cargarProyectos();

        // Evita actualizar la pantalla después de salir de ella.
        return () => controlador.abort();

    }, [token]);

    // Consulta el detalle del proyecto que seleccionó el usuario.
    async function verDetalle(id) {

        setError("");
        setCargandoDetalle(true);
        setProyecto(null);

        try {
            const resultado = await obtenerDetalleProyecto(token, id);

            // Guarda la información del proyecto seleccionado.
            setProyecto(resultado);

        } catch (error) {
            setError(error.message);

        } finally {
            setCargandoDetalle(false);
        }
    }

    return (
        <main className="container py-5">

            <h1 className="mb-4">Mis proyectos</h1>

            {/* Mensaje mientras se carga la lista. */}
            {cargando && (
                <p role="status">Cargando proyectos...</p>
            )}

            {/* Muestra los errores del servidor. */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Mensaje cuando el usuario no tiene proyectos. */}
            {!cargando && !error && proyectos.length === 0 && (
                <div className="alert alert-info">
                    Todavía no tiene proyectos disponibles.
                </div>
            )}

            {/* Crea una tarjeta para cada proyecto recibido. */}
            {!cargando && proyectos.length > 0 && (
                <div className="row g-3">

                    {proyectos.map((item) => (
                        <div
                            className="col-md-6 col-lg-4"
                            key={item.id}
                        >
                            <article className="card h-100">
                                <div className="card-body">

                                    <h2 className="h5">
                                        {item.nombre}
                                    </h2>

                                    <p>{item.descripcion}</p>

                                    {/* Consulta el detalle del proyecto. */}
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => verDetalle(item.id)}
                                    >
                                        Ver detalle
                                    </button>

                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            )}

            {/* Mensaje mientras se consulta el detalle. */}
            {cargandoDetalle && (
                <p className="mt-4" role="status">
                    Cargando detalle...
                </p>
            )}

            {/* Muestra la información del proyecto seleccionado. */}
            {proyecto && (
                <section className="mt-5">

                    <h2>{proyecto.nombre}</h2>

                    <p>{proyecto.descripcion}</p>

                    <p>
                        <strong>Objetivo:</strong>{" "}
                        {proyecto.objetivo}
                    </p>

                    <p>
                        <strong>Estado:</strong>{" "}
                        {proyecto.estado}
                    </p>

                    <p>
                        <strong>Fecha de inicio:</strong>{" "}
                        {proyecto.fechaInicio
                            ? new Date(proyecto.fechaInicio)
                                .toLocaleDateString("es-CR", {
                                    timeZone: "UTC"
                                })
                            : "No indicada"}
                    </p>

                    {/* Consulta GitHub solamente si existe una URL. */}
                    {proyecto.repositorioGitHub && (
                        <RepositorioGitHub
                            url={proyecto.repositorioGitHub}
                        />
                    )}

                </section>
            )}
        </main>
    );
}

export default Proyectos;