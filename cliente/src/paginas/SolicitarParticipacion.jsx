import { useState } from "react";

// Importa el formulario que recoge los datos del estudiante.
import FormularioSolicitud from "../componentes/solicitudes/FormularioSolicitud.jsx";

// Importa la función que envía la solicitud al backend.
import { crearSolicitud } from "../servicios/solicitudes.api.js";

// Página para solicitar participación en una iniciativa.
function SolicitarParticipacion({
    token,
    iniciativaId,
    volverDetalle
}) {

    // Indica si se está guardando la solicitud.
    const [guardando, setGuardando] = useState(false);

    // Guarda los mensajes de error.
    const [error, setError] = useState("");

    // Guarda el mensaje de confirmación.
    const [mensaje, setMensaje] = useState("");

    // Recibe los datos del formulario y los envía al backend.
    async function guardarSolicitud(datos) {

        // Activa el estado de guardado y limpia los mensajes.
        setGuardando(true);
        setError("");
        setMensaje("");

        try {

            // Envía los datos de la solicitud a la iniciativa seleccionada.
            await crearSolicitud(token, iniciativaId, datos);

            // Muestra la confirmación cuando el backend guarda la solicitud.
            setMensaje("Solicitud enviada correctamente.");

        } catch (error) {

            // Muestra el error recibido desde el backend.
            setError(error.message);

        } finally {

            // Habilita nuevamente el botón de guardar.
            setGuardando(false);
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
            <h1>Solicitar participación</h1>

            <p>
                Complete el formulario para solicitar participación
                en esta iniciativa.
            </p>

            {/* Muestra el mensaje si ocurre un error. */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Muestra la confirmación si la solicitud fue enviada. */}
            {mensaje ? (

                <div className="alert alert-success" role="status">
                    {mensaje}
                </div>

            ) : (

                // Muestra el formulario mientras no se haya enviado.
                <section className="card">
                    <div className="card-body p-4">

                        <FormularioSolicitud
                            alGuardar={guardarSolicitud}
                            guardando={guardando}
                        />

                    </div>
                </section>
            )}

        </main>
    );
}

// Permite importar este componente desde App.jsx.
export default SolicitarParticipacion;
