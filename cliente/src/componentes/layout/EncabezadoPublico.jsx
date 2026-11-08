function EncabezadoPublico({ pagina, cambiarPagina }) {

    // Cambia la página cuando el visitante selecciona una opción.
    function navegar(destino) {
        cambiarPagina(destino);
    }

    return (
        <header>
            {/* Barra de navegación pública. */}
            <nav className="navbar navbar-expand-lg bg-white">
                <div className="container">

                    {/* Nombre de la plataforma. */}
                    <button
                        type="button"
                        className="navbar-brand border-0 bg-transparent"
                        onClick={() => navegar("inicio")}
                    >
                        Innovation Hub
                    </button>

                    {/* Botón para abrir el menú en dispositivos pequeños. */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#menuPublico"
                        aria-controls="menuPublico"
                        aria-expanded="false"
                        aria-label="Abrir menú"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Contenedor de las opciones del menú. */}
                    <div
                        className="collapse navbar-collapse"
                        id="menuPublico"
                    >
                        <ul className="navbar-nav ms-auto align-items-lg-center">

                            {/* Enlace a la página de inicio pública. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "inicio" ? "active" : ""}`}
                                    onClick={() => navegar("inicio")}
                                >
                                    Inicio
                                </button>
                            </li>

                            {/* Enlace al formulario de inicio de sesión. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "login" ? "active" : ""}`}
                                    onClick={() => navegar("login")}
                                >
                                    Iniciar sesión
                                </button>
                            </li>

                            {/* Enlace al formulario de registro. */}
                            <li className="nav-item ms-lg-3">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navegar("registro")}
                                >
                                    Registrarse
                                </button>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

// Permite utilizar el encabezado público desde App.jsx.
export default EncabezadoPublico;