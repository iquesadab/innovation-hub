function Encabezado({
    sesion,
    pagina,
    cambiarPagina,
    cerrarSesion
}) {

    // Cambia de página y cierra el menú móvil si está abierto.
    function navegar(destino) {
        cambiarPagina(destino);
    }

    return (
        <header>
            {/* Barra de navegación de Bootstrap. */}
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

                    {/* Botón que abre el menú en pantallas pequeñas. */}
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

                    {/* Contenedor de los enlaces del menú. */}
                    <div
                        className="collapse navbar-collapse"
                        id="menuPrincipal"
                    >
                        <ul className="navbar-nav ms-auto align-items-lg-center">

                            {/* Enlace de inicio, disponible para todos. */}
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link ${pagina === "inicio" ? "active" : ""}`}
                                    onClick={() => navegar("inicio")}
                                >
                                    Inicio
                                </button>
                            </li>

                            {/* Opciones que aparecen si el usuario inició sesión. */}
                            {sesion ? (
                                <>
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className={`nav-link ${pagina === "iniciativas" ? "active" : ""}`}
                                            onClick={() => navegar("iniciativas")}
                                        >
                                            Iniciativas
                                        </button>
                                    </li>

                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className="nav-link"
                                            onClick={() => navegar("publicar")}
                                        >
                                            Publicar
                                        </button>
                                    </li>

                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className="nav-link"
                                            onClick={() => navegar("perfil")}
                                        >
                                            Perfil
                                        </button>
                                    </li>

                                    {/* Cierra la sesión del usuario. */}
                                    <li className="nav-item ms-lg-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={cerrarSesion}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* Opciones que aparecen sin iniciar sesión. */}
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className={`nav-link ${pagina === "login" ? "active" : ""}`}
                                            onClick={() => navegar("login")}
                                        >
                                            Iniciar sesión
                                        </button>
                                    </li>

                                    <li className="nav-item ms-lg-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => navegar("registro")}
                                        >
                                            Registrarse
                                        </button>
                                    </li>
                                </>
                            )}

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Encabezado; // Permite utilizar el encabezado en App.jsx.