import { useEffect, useState } from "react";

import { obtenerDetalleIniciativa } from "../servicios/iniciativas.api.js";

function Detalle({ token, iniciativaId, volverCatalogo }) {

    // Guarda la información de la iniciativa.
    const [iniciativa, setIniciativa] = useState(null);

    // Controla el estado de carga y los errores.
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Consulta los detalles cuando se abre la página.
    useEffect(() => {

        // Evita actualizar el componente después de salir.
        let cancelado = false;

        async function cargarDetalle() {
            setCargando(true);
            setError("");

            try {
                // Obtiene la iniciativa desde MongoDB.
                const resultado = await obtenerDetalleIniciativa(
                    token,
                    iniciativaId
                );

                if (!cancelado) {
                    setIniciativa(resultado);
                }

            } catch (error) {

                // Muestra el error recibido desde el servidor.
                if (!cancelado) {
                    setError(error.message);
                    setIniciativa(null);
                }

            } finally {

                // Finaliza el estado de carga.
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargarDetalle();

        return () => {
            cancelado = true;
        };

    }, [token, iniciativaId]);

    // Traduce los tipos de iniciativas.
    const nombresTipos = {
        idea: "Idea",
        necesidad: "Necesidad",
        reto: "Reto"
    };

    return (
        <main className="container py-5">

            {/* Botón para regresar al catálogo. */}
            <button
                type="button"
                className="btn btn-outline-primary mb-4"
                onClick={volverCatalogo}
            >
                Volver al catálogo
            </button>

            {/* Mensaje mientras se consulta la iniciativa. */}
            {cargando && (
                <p role="status">
                    Cargando información de la iniciativa...
                </p>
            )}

            {/* Mensaje si ocurre algún error. */}
            {!cargando && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Información de la iniciativa. */}
            {!cargando && !error && iniciativa && (
                <>
                    <section className="mb-4">

                        {/* Título y resumen. */}
                        <h1 className="mb-3">
                            {iniciativa.titulo}
                        </h1>

                        <p className="lead">
                            {iniciativa.resumen}
                        </p>

                        {/* Tipo y estado. */}
                        <div className="d-flex gap-2 flex-wrap">
                            <span className="badge text-bg-primary">
                                {nombresTipos[iniciativa.tipo] || iniciativa.tipo}
                            </span>

                            <span className="badge text-bg-secondary">
                                {iniciativa.estado}
                            </span>
                        </div>
                    </section>

                    {/* Información general. */}
                    <section className="card mb-4">
                        <div className="card-body">

                            <h2 className="h5 mb-3">
                                Información general
                            </h2>

                            <p>
                                <strong>Categoría:</strong>{" "}
                                {iniciativa.categoria}
                            </p>

                            <p>
                                <strong>Visibilidad:</strong>{" "}
                                {iniciativa.visibilidad}
                            </p>

                            <p>
                                <strong>Estado:</strong>{" "}
                                {iniciativa.estado}
                            </p>

                        </div>
                    </section>

                    {/* Muestra la descripción si está disponible. */}
                    {iniciativa.descripcion !== undefined && (
                        <section className="card mb-4">
                            <div className="card-body">

                                <h2 className="h5">
                                    Descripción
                                </h2>

                                <p>{iniciativa.descripcion}</p>

                            </div>
                        </section>
                    )}

                    {/* Muestra el problema que busca resolver. */}
                    {iniciativa.problema && (
                        <section className="card mb-4">
                            <div className="card-body">

                                <h2 className="h5">
                                    Problema
                                </h2>

                                <p>{iniciativa.problema}</p>

                            </div>
                        </section>
                    )}

                    {/* Muestra los beneficiarios. */}
                    {iniciativa.beneficiarios && (
                        <section className="card mb-4">
                            <div className="card-body">

                                <h2 className="h5">
                                    Beneficiarios
                                </h2>

                                <p>{iniciativa.beneficiarios}</p>

                            </div>
                        </section>
                    )}

                    {/* Muestra las competencias cuando están disponibles. */}
                    {Array.isArray(iniciativa.competencias) && (
                        <section className="card mb-4">
                            <div className="card-body">

                                <h2 className="h5">
                                    Competencias necesarias
                                </h2>

                                {iniciativa.competencias.length > 0 ? (
                                    <div className="d-flex flex-wrap gap-2">
                                        {iniciativa.competencias.map((competencia) => (
                                            <span
                                                className="badge text-bg-primary"
                                                key={competencia}
                                            >
                                                {competencia}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No se especificaron competencias.</p>
                                )}

                            </div>
                        </section>
                    )}

                    {/* Información del equipo, cuando el backend la permite. */}
                    {iniciativa.miembrosEstimados !== undefined && (
                        <section className="card mb-4">
                            <div className="card-body">

                                <h2 className="h5">
                                    Equipo
                                </h2>

                                <p>
                                    <strong>Integrantes estimados:</strong>{" "}
                                    {iniciativa.miembrosEstimados}
                                </p>

                                {Array.isArray(iniciativa.miembros) && (
                                    <p>
                                        <strong>Integrantes actuales:</strong>{" "}
                                        {iniciativa.miembros.length}
                                    </p>
                                )}

                            </div>
                        </section>
                    )}

                </>
            )}

        </main>
    );
}

// Permite importar la página desde App.jsx.
export default Detalle;