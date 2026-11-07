function Encabezado() {
    return (
        <header>
            {/* Barra de navegación principal */}
            <nav className="navbar navbar-expand-lg">
                <div className="container">

                    {/* Nombre de la aplicación */}
                    <a className="navbar-brand" href="/">
                        Innovation Hub
                    </a>

                    {/* Botón para abrir el menú en pantallas pequeñas */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#menuPrincipal"
                        aria-controls="menuPrincipal"
                        aria-expanded="false"
                        aria-label="Mostrar navegación"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Opciones de navegación */}
                    <div
                        className="collapse navbar-collapse"
                        id="menuPrincipal"
                    >
                        <ul className="navbar-nav ms-auto">

                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    href="/"
                                    aria-current="page"
                                >
                                    Inicio
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#iniciativas">
                                    Iniciativas
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#publicar">
                                    Publicar
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#perfil">
                                    Perfil
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Encabezado;