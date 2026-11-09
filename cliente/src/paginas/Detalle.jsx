import { useEffect, useState } from "react";
import ConvertirProyecto from "../componentes/proyectos/ConvertirProyecto.jsx"; // Importa el formulario para convertir una iniciativa.

// Funciones para consultar y eliminar iniciativas.
import {
    obtenerDetalleIniciativa,
    eliminarIniciativa
} from "../servicios/iniciativas.api.js";


// Página que muestra la información de una iniciativa.
function Detalle({
    token,
    iniciativaId,
    usuarioId,
    volverCatalogo,
    irASolicitar,
    irAGestionar,
    irAEditar,
    alConvertirProyecto
}) {

    // Guarda la información de la iniciativa.
    const [iniciativa, setIniciativa] = useState(null);

    // Controla la carga y los errores.
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Indica si estamos eliminando la iniciativa.
    const [eliminando, setEliminando] = useState(false);


    // Consulta el detalle cuando se abre la página.
    useEffect(() => {

        // Evita actualizar el componente después de salir.
        let cancelado = false;

        async function cargarDetalle() {

            setCargando(true);
            setError("");

            try {

                // Consulta la iniciativa en el backend.
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

                // Finaliza la carga.
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


    // Comprueba si el usuario es propietario de la iniciativa.
    // La comparación se hace como texto para evitar diferencias de tipo.
    const esPropietario = Boolean(
        iniciativa &&
        usuarioId &&
        String(iniciativa.propietarioId) === String(usuarioId)
    );


    // Comprueba si la iniciativa permite nuevas solicitudes.
    const permiteSolicitudes = Boolean(
        iniciativa &&
        iniciativa.estado === "abierta" &&
        !["privada", "institucional"].includes(iniciativa.visibilidad)
    );


    // Elimina la iniciativa después de pedir confirmación.
    async function manejarEliminar() {

        // Pide confirmación para evitar eliminaciones accidentales.
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar esta iniciativa?"
        );

        // Si el usuario cancela, no hacemos nada.
        if (!confirmar) {
            return;
        }

        // Indica que comenzó la eliminación.
        setEliminando(true);
        setError("");

        try {

            // Solicita la eliminación al backend.
            await eliminarIniciativa(token, iniciativaId);

            // Regresa al catálogo después de eliminar.
            volverCatalogo();

        } catch (error) {

            // Muestra el error si no se pudo eliminar.
            setError(error.message);

        } finally {

            // Finaliza el proceso.
            setEliminando(false);
        }
    }


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


            {/* Muestra los errores de consulta o eliminación. */}
            {!cargando && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}


            {/* Información de la iniciativa. */}
            {!cargando && iniciativa && (
                <>

                    {/* Título, resumen y estado. */}
                    <section className="mb-4">

                        <h1 className="mb-3">
                            {iniciativa.titulo}
                        </h1>

                        <p className="lead">
                            {iniciativa.resumen}
                        </p>

                        <div className="d-flex gap-2 flex-wrap">

                            <span className="badge text-bg-primary">
                                {nombresTipos[iniciativa.tipo] || iniciativa.tipo}
                            </span>

                            <span className="badge text-bg-secondary">
                                {iniciativa.estado}
                            </span>

                        </div>

                    </section>


                    {/* Botones según el usuario que está consultando. */}
                    <section className="mb-4">

                        <div className="d-flex flex-wrap gap-2">

                            {/* El propietario puede administrar su iniciativa. */}
                            {esPropietario ? (
                                <>

                                    {/* Abre la página para editar. */}
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={irAEditar}
                                    >
                                        Editar iniciativa
                                    </button>


                                    {/* Abre las solicitudes recibidas. */}
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={irAGestionar}
                                    >
                                        Gestionar solicitudes
                                    </button>


                                    {/* Solicita eliminar la iniciativa. */}
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        disabled={eliminando}
                                        onClick={manejarEliminar}
                                    >
                                        {eliminando
                                            ? "Eliminando..."
                                            : "Eliminar iniciativa"}
                                    </button>

                                </>

                            ) : (

                                // Otros usuarios pueden solicitar participación
                                // si la iniciativa está abierta y es visible.
                                permiteSolicitudes && (

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={irASolicitar}
                                    >
                                        Solicitar participación
                                    </button>

                                )
                            )}

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


                    {/* Descripción de la iniciativa. */}
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


                    {/* Problema que busca resolver. */}
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


                    {/* Personas beneficiadas. */}
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


                    {/* Competencias necesarias. */}
                    {Array.isArray(iniciativa.competencias) && (

                        <section className="card mb-4">

                            <div className="card-body">

                                <h2 className="h5">
                                    Competencias necesarias
                                </h2>

                                {iniciativa.competencias.length > 0 ? (

                                    <div className="d-flex flex-wrap gap-2">

                                        {iniciativa.competencias.map(
                                            (competencia) => (

                                                <span
                                                    className="badge text-bg-primary"
                                                    key={competencia}
                                                >
                                                    {competencia}
                                                </span>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <p>
                                        No se especificaron competencias.
                                    </p>

                                )}

                            </div>

                        </section>
                    )}


                    {/* Información del equipo. */}
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

                    {/* Solo el propietario puede ver el formulario de conversión. */}
                    {esPropietario && iniciativa.estado === "abierta" && (
                        <ConvertirProyecto
                            token={token}
                            iniciativaId={iniciativaId}
                            alConvertir={alConvertirProyecto}
                        />
                    )}

                </>
            )}

        </main>
    );
}


// Permite utilizar la página desde App.jsx.
export default Detalle;