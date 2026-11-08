import { useState } from "react"; // Permite guardar y actualizar datos en React.
import { iniciarSesion } from "../servicios/auth.api.js"; // Función que se comunica con el backend.

// Componente que muestra el formulario de inicio de sesión.
function Login({ alIniciarSesion }) {

    // Guarda los valores del formulario y permite actualizarlos.
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    // Guarda los mensajes de error.
    // error: Guarda el valor actual del error
    // setError: Permite cambiar ese valor
    // useState(""): Inicializa el error como texto vacío
    const [error, setError] = useState("");

    // Indica si estamos esperando la respuesta del servidor.
    const [cargando, setCargando] = useState(false);

    // Se ejecuta cuando el usuario envía el formulario.
    async function manejarEnvio(evento) {
        evento.preventDefault(); // Evita que se recargue la página.

        setError(""); // Limpia los errores anteriores.

        // Comprueba que los campos no estén vacíos.
        if (!correo.trim() || !contrasena) {
            setError("Debe completar el correo y la contraseña.");
            return; // Detiene la función si faltan datos.
        }

        setCargando(true); // Indica que comienza la petición.

        try {
            // Envía las credenciales al backend y espera la respuesta.
            const resultado = await iniciarSesion(
                correo.trim(),
                contrasena
            );

            // Envía el resultado a App.jsx para guardar la sesión.
            alIniciarSesion(resultado);

        } catch (error) {
            setError(error.message); // Muestra el error recibido.

        } finally {
            setCargando(false); // Finaliza la espera.
        }
    }

    // Devuelve los elementos que React mostrará en pantalla.
    return (
        <main className="container py-5">

            {/* Centra el formulario horizontalmente. */}
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">

                    {/* Tarjeta que contiene el formulario. */}
                    <section className="card">
                        <div className="card-body p-4">

                            <h1 className="h3 mb-2">
                                Iniciar sesión
                            </h1>

                            <p className="mb-4">
                                Ingrese sus datos para acceder
                                a Innovation Hub.
                            </p>

                            {/* Muestra una alerta solamente si existe un error. */}
                            {error && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Ejecuta manejarEnvio cuando se envía el formulario. */}
                            <form onSubmit={manejarEnvio} noValidate>

                                {/* Campo para escribir el correo electrónico. */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="correo"
                                        className="form-label"
                                    >
                                        Correo electrónico
                                    </label>

                                    <input
                                        type="email"
                                        id="correo"
                                        className="form-control"
                                        value={correo}
                                        // Actualiza el correo mientras se escribe.
                                        onChange={(evento) =>
                                            setCorreo(evento.target.value)
                                        }
                                        autoComplete="username"
                                    />
                                </div>

                                {/* Campo para escribir la contraseña. */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="contrasena"
                                        className="form-label"
                                    >
                                        Contraseña
                                    </label>

                                    <input
                                        type="password"
                                        id="contrasena"
                                        className="form-control"
                                        value={contrasena}
                                        // Actualiza la contraseña mientras se escribe.
                                        onChange={(evento) =>
                                            setContrasena(evento.target.value)
                                        }
                                        autoComplete="current-password"
                                    />
                                </div>

                                {/* Desactiva el botón mientras se procesa el login. */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={cargando}
                                >
                                    {/* Cambia el texto según el estado de carga. */}
                                    {cargando
                                        ? "Iniciando sesión..."
                                        : "Ingresar"}
                                </button>

                            </form>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}

// Permite utilizar Login desde App.jsx.
export default Login;