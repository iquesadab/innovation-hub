import { useEffect, useState } from "react";

import {
    obtenerPerfil,
    actualizarPerfil
} from "../servicios/usuarios.api.js";

function Perfil({ token, alActualizarPerfil }) {

    // Guarda los datos del formulario.
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [carrera, setCarrera] = useState("");
    const [competencias, setCompetencias] = useState("");
    const [disponibilidad, setDisponibilidad] = useState("");

    // Controla la carga, el guardado y los mensajes.
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Consulta el perfil al abrir la página.
    useEffect(() => {

        let cancelado = false;

        async function cargarPerfil() {
            setCargando(true);
            setError("");

            try {
                // Obtiene los datos desde MongoDB.
                const usuario = await obtenerPerfil(token);

                if (!cancelado) {
                    setNombre(usuario.nombre || "");
                    setCorreo(usuario.correo || "");
                    setCarrera(usuario.carrera || "");

                    // Convierte las competencias en texto separado por comas.
                    setCompetencias(
                        Array.isArray(usuario.competencias)
                            ? usuario.competencias.join(", ")
                            : ""
                    );

                    setDisponibilidad(usuario.disponibilidad || "");
                }

            } catch (error) {

                if (!cancelado) {
                    setError(error.message);
                }

            } finally {

                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargarPerfil();

        return () => {
            cancelado = true;
        };

    }, [token]);

    // Valida y guarda los cambios del perfil.
    async function manejarEnvio(evento) {
        evento.preventDefault();

        setError("");
        setMensaje("");

        // Elimina espacios innecesarios.
        const nombreLimpio = nombre.trim();
        const carreraLimpia = carrera.trim();
        const disponibilidadLimpia = disponibilidad.trim();

        // Convierte las competencias en un arreglo.
        const listaCompetencias = competencias
            .split(",")
            .map((valor) => valor.trim())
            .filter((valor) => valor !== "");

        // Comprueba los campos principales.
        if (!nombreLimpio) {
            setError("Debe ingresar su nombre.");
            return;
        }

        if (!carreraLimpia) {
            setError("Debe ingresar su carrera.");
            return;
        }

        // Comprueba que no existan competencias repetidas.
        const competenciasUnicas = new Set(
            listaCompetencias.map((valor) => valor.toLowerCase())
        );

        if (competenciasUnicas.size !== listaCompetencias.length) {
            setError("No puede repetir competencias.");
            return;
        }

        // Prepara solamente los datos editables.
        const cambios = {
            nombre: nombreLimpio,
            carrera: carreraLimpia,
            competencias: listaCompetencias,
            disponibilidad: disponibilidadLimpia
        };

        setGuardando(true);

        try {
            // Guarda los cambios en MongoDB.
            const usuarioActualizado = await actualizarPerfil(
                token,
                cambios
            );

            // Actualiza los datos visibles del formulario.
            setNombre(usuarioActualizado.nombre || "");
            setCarrera(usuarioActualizado.carrera || "");
            setCompetencias(
                Array.isArray(usuarioActualizado.competencias)
                    ? usuarioActualizado.competencias.join(", ")
                    : ""
            );
            setDisponibilidad(
                usuarioActualizado.disponibilidad || ""
            );

            setMensaje("Perfil actualizado correctamente.");

            // Informa a App.jsx sobre los cambios.
            if (alActualizarPerfil) {
                alActualizarPerfil(usuarioActualizado);
            }

        } catch (error) {

            setError(error.message);

        } finally {

            setGuardando(false);
        }
    }

    return (
        <main className="container py-5">

            {/* Encabezado de la página. */}
            <section className="mb-4">
                <h1>Mi perfil</h1>
                <p>
                    Consulte y actualice su información para
                    participar en iniciativas de Innovation Hub.
                </p>
            </section>

            {/* Mensaje mientras se consulta el perfil. */}
            {cargando && (
                <p role="status">Cargando perfil...</p>
            )}

            {/* Formulario del perfil. */}
            {!cargando && (
                <section className="card">
                    <div className="card-body p-4">

                        {/* Muestra errores y confirmaciones. */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {mensaje && (
                            <div className="alert alert-success" role="status">
                                {mensaje}
                            </div>
                        )}

                        <form onSubmit={manejarEnvio} noValidate>

                            <h2 className="h5 mb-3">
                                Información personal
                            </h2>

                            <div className="row g-3">

                                {/* Nombre del usuario. */}
                                <div className="col-md-6">
                                    <label
                                        htmlFor="nombre"
                                        className="form-label"
                                    >
                                        Nombre
                                    </label>

                                    <input
                                        id="nombre"
                                        type="text"
                                        className="form-control"
                                        value={nombre}
                                        onChange={(evento) =>
                                            setNombre(evento.target.value)
                                        }
                                    />
                                </div>

                                {/* Correo de consulta, no editable. */}
                                <div className="col-md-6">
                                    <label
                                        htmlFor="correo"
                                        className="form-label"
                                    >
                                        Correo electrónico
                                    </label>

                                    <input
                                        id="correo"
                                        type="email"
                                        className="form-control"
                                        value={correo}
                                        readOnly
                                    />

                                    <div className="form-text">
                                        El correo no se puede modificar aquí.
                                    </div>
                                </div>

                                {/* Carrera del usuario. */}
                                <div className="col-12">
                                    <label
                                        htmlFor="carrera"
                                        className="form-label"
                                    >
                                        Carrera
                                    </label>

                                    <input
                                        id="carrera"
                                        type="text"
                                        className="form-control"
                                        value={carrera}
                                        onChange={(evento) =>
                                            setCarrera(evento.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            <hr className="my-4" />

                            <h2 className="h5 mb-3">
                                Competencias y disponibilidad
                            </h2>

                            <div className="row g-3">

                                {/* Competencias del usuario. */}
                                <div className="col-12">
                                    <label
                                        htmlFor="competencias"
                                        className="form-label"
                                    >
                                        Competencias
                                    </label>

                                    <input
                                        id="competencias"
                                        type="text"
                                        className="form-control"
                                        placeholder="Ejemplo: JavaScript, React, Diseño UX"
                                        value={competencias}
                                        onChange={(evento) =>
                                            setCompetencias(evento.target.value)
                                        }
                                    />

                                    <div className="form-text">
                                        Separe cada competencia con una coma.
                                    </div>
                                </div>

                                {/* Disponibilidad para colaborar. */}
                                <div className="col-12">
                                    <label
                                        htmlFor="disponibilidad"
                                        className="form-label"
                                    >
                                        Disponibilidad
                                    </label>

                                    <textarea
                                        id="disponibilidad"
                                        className="form-control"
                                        rows="3"
                                        placeholder="Ejemplo: 6 horas semanales, por las tardes."
                                        value={disponibilidad}
                                        onChange={(evento) =>
                                            setDisponibilidad(evento.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            {/* Botón para guardar los cambios. */}
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={guardando}
                                >
                                    {guardando
                                        ? "Guardando..."
                                        : "Guardar cambios"}
                                </button>
                            </div>

                        </form>

                    </div>
                </section>
            )}

        </main>
    );
}

export default Perfil;