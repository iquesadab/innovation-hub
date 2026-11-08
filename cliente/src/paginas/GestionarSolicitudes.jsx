import { useEffect, useState } from "react";

// Importamos las funciones para consultar y revisar solicitudes.
import {
    obtenerSolicitudesIniciativa,
    revisarSolicitud
} from "../servicios/solicitudes.api.js";


// Página para gestionar las solicitudes recibidas.
function GestionarSolicitudes({
    token,
    iniciativaId,
    volverDetalle
}) {

    // Guarda las solicitudes recibidas por la iniciativa.
    const [solicitudes, setSolicitudes] = useState([]);

    // Guarda el estado seleccionado en el filtro.
    // Vacío significa que queremos consultar todas las solicitudes.
    const [estado, setEstado] = useState("");

    // Indica si estamos consultando las solicitudes.
    const [cargando, setCargando] = useState(true);

    // Guarda el ID de la solicitud que se está revisando.
    // Vacío significa que no estamos procesando ninguna.
    const [procesando, setProcesando] = useState("");

    // Guarda los mensajes de error y confirmación.
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // Consulta las solicitudes cuando se abre la página
    // o cuando el propietario cambia el filtro.
    useEffect(() => {

        // Evita actualizar el componente después de salir de la página.
        let cancelado = false;

        // Función que consulta las solicitudes en el backend.
        async function cargarSolicitudes() {

            // Muestra el mensaje de carga.
            setCargando(true);

            // Limpia los errores anteriores.
            setError("");

            try {

                // Consulta las solicitudes de la iniciativa seleccionada.
                // También envía el estado si se aplicó algún filtro.
                const resultado = await obtenerSolicitudesIniciativa(
                    token,
                    iniciativaId,
                    estado
                );

                // Guarda los resultados para mostrarlos en pantalla.
                if (!cancelado) {
                    setSolicitudes(resultado);
                }

            } catch (error) {

                // Muestra el error recibido desde el backend.
                if (!cancelado) {
                    setError(error.message);
                }

            } finally {

                // Finaliza el proceso de carga.
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        // Ejecuta la consulta.
        cargarSolicitudes();

        // Limpieza cuando salimos de la página.
        return () => {
            cancelado = true;
        };

    }, [token, iniciativaId, estado]);


    // Permite aceptar o rechazar una solicitud pendiente.
    async function revisar(id, decision) {

        // Guarda el ID de la solicitud que estamos revisando.
        setProcesando(id);

        // Limpia los mensajes anteriores.
        setError("");
        setMensaje("");

        try {

            // Envía al backend la decisión del propietario.
            // decision puede ser "aceptada" o "rechazada".
            await revisarSolicitud(token, id, decision);

            // Consulta nuevamente las solicitudes para actualizar la lista.
            const resultado = await obtenerSolicitudesIniciativa(
                token,
                iniciativaId,
                estado
            );

            // Guarda la lista actualizada.
            setSolicitudes(resultado);

            // Muestra un mensaje según la decisión tomada.
            if (decision === "aceptada") {
                setMensaje("Solicitud aceptada correctamente.");
            } else {
                setMensaje("Solicitud rechazada correctamente.");
            }

        } catch (error) {

            // Muestra el mensaje si el backend rechaza la operación.
            setError(error.message);

        } finally {

            // Finaliza el proceso y habilita nuevamente los botones.
            setProcesando("");
        }
    }


    return (
        <main className="container py-5">

            {/* Botón para regresar al detalle de la iniciativa. */}
            <button
                type="button"
                className="btn btn-outline-primary mb-4"
                onClick={volverDetalle}
            >
                Volver al detalle
            </button>


            {/* Título principal de la página. */}
            <h1>Gestionar solicitudes</h1>

            <p>
                Consulte y revise las solicitudes recibidas
                para su iniciativa.
            </p>


            {/* Filtro para consultar solicitudes por estado. */}
            <div className="mb-4">

                <label
                    htmlFor="filtroEstado"
                    className="form-label"
                >
                    Filtrar por estado
                </label>

                <select
                    id="filtroEstado"
                    className="form-select"
                    value={estado}
                    onChange={(evento) => setEstado(evento.target.value)}
                >
                    <option value="">Todas las solicitudes</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="aceptada">Aceptadas</option>
                    <option value="rechazada">Rechazadas</option>
                    <option value="cancelada">Canceladas</option>
                </select>

            </div>


            {/* Muestra un mensaje cuando ocurre algún error. */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}


            {/* Muestra una confirmación después de revisar una solicitud. */}
            {mensaje && (
                <div className="alert alert-success" role="status">
                    {mensaje}
                </div>
            )}


            {/* Mensaje mientras se consultan los datos. */}
            {cargando && (
                <p role="status">Cargando solicitudes...</p>
            )}


            {/* Mensaje cuando no existen solicitudes para el filtro. */}
            {!cargando && !error && solicitudes.length === 0 && (
                <p>No hay solicitudes para mostrar.</p>
            )}


            {/* Recorre las solicitudes y crea una tarjeta para cada una. */}
            {!cargando && solicitudes.map((solicitud) => (

                <article
                    className="card mb-3"
                    key={solicitud.id}
                >

                    <div className="card-body">

                        {/* Título de la tarjeta. */}
                        <h2 className="h5">
                            Solicitud recibida
                        </h2>


                        {/* Información del estudiante que envió la solicitud. */}
                        <p>
                            <strong>Usuario:</strong>{" "}
                            {solicitud.usuarioId}
                        </p>

                        <p>
                            <strong>Estado:</strong>{" "}
                            {solicitud.estado}
                        </p>

                        <p>
                            <strong>Motivo:</strong>{" "}
                            {solicitud.motivo}
                        </p>

                        <p>
                            <strong>Experiencia:</strong>{" "}
                            {solicitud.experiencia || "No indicada"}
                        </p>

                        <p>
                            <strong>Disponibilidad:</strong>{" "}
                            {solicitud.disponibilidad}
                        </p>

                        <p>
                            <strong>Competencias:</strong>{" "}
                            {(solicitud.competencias || []).join(", ") ||
                                "No indicadas"}
                        </p>


                        {/* Los botones solo aparecen si está pendiente. */}
                        {solicitud.estado === "pendiente" && (

                            <div className="d-flex flex-wrap gap-2">

                                {/* Acepta la solicitud del estudiante. */}
                                <button
                                    type="button"
                                    className="btn btn-primary"

                                    // Desactiva los botones mientras se revisa.
                                    disabled={procesando !== ""}

                                    // Envía la decisión "aceptada".
                                    onClick={() =>
                                        revisar(solicitud.id, "aceptada")
                                    }
                                >
                                    {procesando === solicitud.id
                                        ? "Procesando..."
                                        : "Aceptar"}
                                </button>


                                {/* Rechaza la solicitud del estudiante. */}
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"

                                    // Evita revisar varias solicitudes a la vez.
                                    disabled={procesando !== ""}

                                    // Envía la decisión "rechazada".
                                    onClick={() =>
                                        revisar(solicitud.id, "rechazada")
                                    }
                                >
                                    Rechazar
                                </button>

                            </div>
                        )}

                    </div>
                </article>
            ))}

        </main>
    );
}


// Permite utilizar esta página desde App.jsx.
export default GestionarSolicitudes;