import { useEffect, useState } from "react";

// Importamos el formulario que ya creamos para reutilizarlo al editar.
import FormularioSolicitud from "../componentes/solicitudes/FormularioSolicitud.jsx";

// Importamos las funciones que se comunican con el backend.
import {
    obtenerMisSolicitudes,
    editarSolicitud,
    cancelarSolicitud
} from "../servicios/solicitudes.api.js";


// Página para consultar y administrar las solicitudes del usuario.
function MisSolicitudes({ token }) {

    // Guarda la lista de solicitudes que devuelve MongoDB.
    const [solicitudes, setSolicitudes] = useState([]);

    // Guarda la solicitud que el usuario está editando.
    // null significa que no estamos editando ninguna.
    const [editando, setEditando] = useState(null);

    // Controla si estamos cargando las solicitudes.
    const [cargando, setCargando] = useState(true);

    // Controla si estamos guardando cambios.
    const [guardando, setGuardando] = useState(false);

    // Controla si estamos cancelando una solicitud.
    const [cancelando, setCancelando] = useState("");

    // Guarda los mensajes de error y confirmación.
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // Consulta nuevamente las solicitudes desde el backend.
    // La utilizamos después de editar o cancelar.
    async function cargarSolicitudes() {
        const resultado = await obtenerMisSolicitudes(token);

        // Actualiza la lista que aparece en pantalla.
        setSolicitudes(resultado);
    }


    // Se ejecuta cuando se abre la página o cambia el token.
    useEffect(() => {

        // Permite evitar actualizar la página si el componente se desmonta.
        let cancelado = false;

        // Consulta las solicitudes del usuario.
        async function cargar() {
            setCargando(true);
            setError("");

            try {

                // Obtiene las solicitudes desde MongoDB mediante la API.
                const resultado = await obtenerMisSolicitudes(token);

                // Guarda las solicitudes para mostrarlas en pantalla.
                if (!cancelado) {
                    setSolicitudes(resultado);
                }

            } catch (error) {

                // Muestra el error si no se pudieron consultar.
                if (!cancelado) {
                    setError(error.message);
                }

            } finally {

                // Finaliza la carga, incluso si ocurrió un error.
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargar();

        // Limpieza cuando salimos de la página.
        return () => {
            cancelado = true;
        };

    }, [token]);


    // Guarda los cambios de una solicitud pendiente.
    async function guardarCambios(datos) {

        // Evita enviar cambios si no seleccionamos una solicitud.
        if (!editando) {
            return;
        }

        setGuardando(true);
        setError("");
        setMensaje("");

        try {

            // Envía los nuevos datos al backend.
            await editarSolicitud(token, editando.id, datos);

            // Consulta nuevamente la lista actualizada.
            await cargarSolicitudes();

            // Cierra el formulario de edición.
            setEditando(null);

            // Muestra un mensaje de confirmación.
            setMensaje("Solicitud actualizada correctamente.");

        } catch (error) {

            // Muestra el mensaje enviado por el backend.
            setError(error.message);

        } finally {

            // Habilita nuevamente el botón de guardar.
            setGuardando(false);
        }
    }


    // Cancela una solicitud que todavía está pendiente.
    async function cancelar(id) {

        // Pide confirmación antes de cancelar.
        const confirmar = window.confirm(
            "¿Está seguro de que desea cancelar esta solicitud?"
        );

        // Si el usuario presiona Cancelar, no hacemos nada.
        if (!confirmar) {
            return;
        }

        setCancelando(id);
        setError("");
        setMensaje("");

        try {

            // Solicita al backend cambiar el estado a cancelada.
            await cancelarSolicitud(token, id);

            // Actualiza la lista para mostrar el nuevo estado.
            await cargarSolicitudes();

            // Cierra el formulario si estaba editando esa solicitud.
            if (editando?.id === id) {
                setEditando(null);
            }

            // Muestra la confirmación.
            setMensaje("Solicitud cancelada correctamente.");

        } catch (error) {

            // Muestra el error si no fue posible cancelarla.
            setError(error.message);

        } finally {

            // Finaliza el proceso de cancelación.
            setCancelando("");
        }
    }


    return (
        <main className="container py-5">

            {/* Título principal de la página. */}
            <h1>Mis solicitudes</h1>

            <p>
                Consulte el estado de sus solicitudes de participación.
            </p>


            {/* Muestra errores enviados por el backend. */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}


            {/* Muestra mensajes cuando una operación fue correcta. */}
            {mensaje && (
                <div className="alert alert-success" role="status">
                    {mensaje}
                </div>
            )}


            {/* Muestra un mensaje mientras se consultan los datos. */}
            {cargando && (
                <p role="status">Cargando solicitudes...</p>
            )}


            {/* Aparece cuando el usuario no tiene solicitudes. */}
            {!cargando && !error && solicitudes.length === 0 && (
                <p>Todavía no ha enviado solicitudes de participación.</p>
            )}


            {/* Recorre la lista y muestra una tarjeta por solicitud. */}
            {!cargando && solicitudes.map((solicitud) => (

                <article className="card mb-3" key={solicitud.id}>

                    <div className="card-body">

                        {/* Información principal de la solicitud. */}
                        <h2 className="h5">
                            Solicitud de participación
                        </h2>

                        <p>
                            <strong>Iniciativa:</strong>{" "}
                            {solicitud.iniciativaId}
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


                        {/* Solo permite editar o cancelar si está pendiente. */}
                        {solicitud.estado === "pendiente" && (

                            <div className="d-flex flex-wrap gap-2">

                                {/* Abre o cierra el formulario de edición. */}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    disabled={guardando || cancelando !== ""}
                                    onClick={() => {

                                        // Si ya estamos editando esta solicitud,
                                        // cerramos el formulario.
                                        if (editando?.id === solicitud.id) {
                                            setEditando(null);
                                        } else {

                                            // De lo contrario, abrimos su edición.
                                            setEditando(solicitud);
                                        }
                                    }}
                                >
                                    {editando?.id === solicitud.id
                                        ? "Cerrar edición"
                                        : "Editar"}
                                </button>


                                {/* Cancela la solicitud seleccionada. */}
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    disabled={guardando || cancelando !== ""}
                                    onClick={() => cancelar(solicitud.id)}
                                >
                                    {cancelando === solicitud.id
                                        ? "Cancelando..."
                                        : "Cancelar solicitud"}
                                </button>

                            </div>
                        )}


                        {/* Muestra el formulario de la solicitud seleccionada. */}
                        {editando?.id === solicitud.id && (

                            <div className="mt-4">

                                <h3 className="h6">
                                    Editar solicitud
                                </h3>

                                {/* Reutilizamos el formulario existente. */}
                                <FormularioSolicitud

                                    // Identifica el formulario de esta solicitud.
                                    key={solicitud.id}

                                    // Coloca los datos anteriores en los campos.
                                    inicial={solicitud}

                                    // Indica qué función guarda los cambios.
                                    alGuardar={guardarCambios}

                                    // Desactiva guardar mientras se procesa.
                                    guardando={guardando}
                                />

                            </div>
                        )}

                    </div>
                </article>
            ))}

        </main>
    );
}


// Permite importar esta página desde App.jsx.
export default MisSolicitudes;