function Encabezado({ pagina, cambiarPagina, cerrarSesion }) {

    // Cambia la página seleccionada.
    function navegar(destino) {
        cambiarPagina(destino);
    }

    return (
        <header>
            {/* Barra de navegación de usuarios autenticados. */}
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

                    {/* Botón para mostrar el menú en pantallas pequeñas. */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#menuPrincipal"
                        aria-controls="menuPrincipal"
                        aria-expanded="false"
                        aria-label="Abrir menú"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Opciones disponibles después de iniciar sesión. */}
                    <div
                        className="collapse navbar-collapse"
                        id="menuPrincipal"
                    >
                        <ul className="navbar-nav ms-auto align-items-lg-center">

                            {/* Página principal del usuario. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "inicio" ? "active" : ""}`}
                                    onClick={() => navegar("inicio")}
                                >
                                    Inicio
                                </button>
                            </li>

                            {/* Catálogo de iniciativas. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "iniciativas" ? "active" : ""}`}
                                    onClick={() => navegar("iniciativas")}
                                >
                                    Iniciativas
                                </button>
                            </li>

                            {/* Página para publicar iniciativas. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "publicar" ? "active" : ""}`}
                                    onClick={() => navegar("publicar")}
                                >
                                    Publicar
                                </button>
                            </li>

                            {/* Página del perfil. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "perfil" ? "active" : ""}`}
                                    onClick={() => navegar("perfil")}
                                >
                                    Perfil
                                </button>
                            </li>

                            {/* Botón para cerrar la sesión. */}
                            <li className="nav-item ms-lg-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={cerrarSesion}
                                >
                                    Cerrar sesión
                                </button>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

// Permite utilizar el encabezado desde App.jsx.
export default Encabezado;