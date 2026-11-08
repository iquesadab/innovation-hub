import { useState } from "react"; // Permite guardar los datos del formulario.
import { registrarUsuario } from "../servicios/auth.api.js"; // Función para registrar usuarios.

function Registro({ alRegistrarse, irALogin }) {

    // Guarda la información que escribe el usuario.
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [carrera, setCarrera] = useState("");
    const [competencias, setCompetencias] = useState("");
    const [disponibilidad, setDisponibilidad] = useState("");

    const [error, setError] = useState(""); // Guarda los errores.
    const [cargando, setCargando] = useState(false); // Controla la espera del servidor.

    // Se ejecuta cuando el usuario envía el formulario.
    async function manejarEnvio(evento) {
        evento.preventDefault(); // Evita recargar la página.
        setError(""); // Limpia errores anteriores.

        // Comprueba que los campos obligatorios estén completos.
        if (
            !nombre.trim() ||
            !correo.trim() ||
            !contrasena ||
            !carrera.trim() ||
            !disponibilidad.trim()
        ) {
            setError("Debe completar todos los campos obligatorios.");
            return;
        }

        // Comprueba la longitud de los campos.
        if (nombre.trim().length < 3 || nombre.trim().length > 100) {
            setError("El nombre debe tener entre 3 y 100 caracteres.");
            return;
        }

        if (carrera.trim().length < 2 || carrera.trim().length > 100) {
            setError("La carrera debe tener entre 2 y 100 caracteres.");
            return;
        }

        if (disponibilidad.trim().length < 2 || disponibilidad.trim().length > 100) {
            setError("La disponibilidad debe tener entre 2 y 100 caracteres.");
            return;
        }

        if (contrasena.length < 8 || contrasena.length > 72) {
            setError("La contraseña debe tener entre 8 y 72 caracteres.");
            return;
        }

        // Convierte las competencias separadas por comas en un arreglo.
        const listaCompetencias = competencias.trim()
            ? competencias.split(",").map(item => item.trim())
            : [];

        // Revisa la cantidad y longitud de las competencias.
        if (
            listaCompetencias.length > 20 ||
            listaCompetencias.some(item => item.length < 2 || item.length > 50)
        ) {
            setError("Ingrese hasta 20 competencias de 2 a 50 caracteres.");
            return;
        }

        // Comprueba que no existan competencias repetidas.
        const competenciasUnicas = new Set(
            listaCompetencias.map(item => item.toLowerCase())
        );

        if (competenciasUnicas.size !== listaCompetencias.length) {
            setError("No puede repetir competencias.");
            return;
        }

        // Prepara los datos con los nombres que espera Express.
        const nuevoUsuario = {
            nombre: nombre.trim(),
            correo: correo.trim(),
            contrasena,
            carrera: carrera.trim(),
            competencias: listaCompetencias,
            disponibilidad: disponibilidad.trim()
        };

        setCargando(true); // Desactiva el botón durante la petición.

        try {
            await registrarUsuario(nuevoUsuario); // Envía el registro al backend.
            alRegistrarse(); // Avisa a App.jsx que el registro terminó.

        } catch (error) {
            setError(error.message); // Muestra el error recibido.

        } finally {
            setCargando(false); // Termina la espera.
        }
    }

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">

                    {/* Tarjeta principal del formulario. */}
                    <section className="card">
                        <div className="card-body p-4">

                            <h1 className="h3 mb-2">Crear cuenta</h1>
                            <p className="mb-4">
                                Regístrese para participar en Innovation Hub.
                            </p>

                            {/* Muestra los errores del formulario o del backend. */}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={manejarEnvio} noValidate>

                                {/* Nombre completo. */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        className="form-control"
                                        value={nombre}
                                        onChange={evento => setNombre(evento.target.value)}
                                        autoComplete="name"
                                    />
                                </div>

                                {/* Correo electrónico. */}
                                <div className="mb-3">
                                    <label htmlFor="correoRegistro" className="form-label">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="correoRegistro"
                                        className="form-control"
                                        value={correo}
                                        onChange={evento => setCorreo(evento.target.value)}
                                        autoComplete="email"
                                    />
                                </div>

                                {/* Contraseña de la nueva cuenta. */}
                                <div className="mb-3">
                                    <label htmlFor="contrasenaRegistro" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="contrasenaRegistro"
                                        className="form-control"
                                        value={contrasena}
                                        onChange={evento => setContrasena(evento.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <div className="form-text">
                                        Entre 8 y 72 caracteres.
                                    </div>
                                </div>

                                {/* Carrera del usuario. */}
                                <div className="mb-3">
                                    <label htmlFor="carrera" className="form-label">
                                        Carrera
                                    </label>
                                    <input
                                        type="text"
                                        id="carrera"
                                        className="form-control"
                                        value={carrera}
                                        onChange={evento => setCarrera(evento.target.value)}
                                        placeholder="Ejemplo: Ingeniería en Software"
                                    />
                                </div>

                                {/* Competencias separadas por comas. */}
                                <div className="mb-3">
                                    <label htmlFor="competencias" className="form-label">
                                        Competencias
                                    </label>
                                    <input
                                        type="text"
                                        id="competencias"
                                        className="form-control"
                                        value={competencias}
                                        onChange={evento => setCompetencias(evento.target.value)}
                                        placeholder="Java, React, Trabajo en equipo"
                                    />
                                    <div className="form-text">
                                        Separe las competencias con comas. Puede dejarlo vacío.
                                    </div>
                                </div>

                                {/* Disponibilidad del usuario. */}
                                <div className="mb-4">
                                    <label htmlFor="disponibilidad" className="form-label">
                                        Disponibilidad
                                    </label>
                                    <input
                                        type="text"
                                        id="disponibilidad"
                                        className="form-control"
                                        value={disponibilidad}
                                        onChange={evento => setDisponibilidad(evento.target.value)}
                                        placeholder="Ejemplo: Fines de semana"
                                    />
                                </div>

                                {/* Envía los datos del registro. */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={cargando}
                                >
                                    {cargando ? "Registrando..." : "Crear cuenta"}
                                </button>

                            </form>

                            {/* Permite ir al inicio de sesión. */}
                            <p className="text-center mt-3 mb-0">
                                ¿Ya tiene una cuenta?{" "}
                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={irALogin}
                                >
                                    Iniciar sesión
                                </button>
                            </p>

                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}

export default Registro; // Permite importar el componente desde App.jsx.
