function InicioPublico({ cambiarPagina }) {

    return (
        <main>

            {/* SECCIÓN DE BIENVENIDA */}
            <section
                className="py-5 text-center"
                style={{ backgroundColor: "#173B57", color: "#FFFFFF" }}
            >
                <div className="container py-4">

                    {/* Texto introductorio. */}
                    <p
                        className="fw-semibold text-uppercase"
                        style={{ color: "#74DED8" }}
                    >
                        Bienvenido a Innovation Hub
                    </p>

                    {/* Título principal. */}
                    <h1 className="display-5 fw-bold mb-4 text-white">
                        Donde las ideas se convierten en oportunidades
                    </h1>

                    {/* Descripción de la plataforma. */}
                    <p className="lead mb-4 mx-auto text-white" style={{ maxWidth: "700px" }}>
                        Un espacio para conectar personas, compartir
                        conocimientos y desarrollar iniciativas innovadoras.
                    </p>

                    {/* Botones para acceder al registro y al login. */}
                    <div className="d-flex justify-content-center gap-3 flex-wrap">

                        <button
                            type="button"
                            className="btn btn-secondary px-4"
                            onClick={() => cambiarPagina("registro")}
                        >
                            Crear una cuenta
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-light px-4"
                            onClick={() => cambiarPagina("login")}
                        >
                            Iniciar sesión
                        </button>

                    </div>
                </div>
            </section>


            {/* SECCIÓN DE BENEFICIOS */}
            <section className="container py-5">

                {/* Título de la sección. */}
                <h2 className="text-center mb-2">
                    ¿Qué puede hacer en Innovation Hub?
                </h2>

                <p className="text-center mb-4">
                    Conozca las posibilidades de nuestra comunidad.
                </p>

                {/* Tarjetas organizadas con el grid de Bootstrap. */}
                <div className="row g-4">

                    {/* Tarjeta para compartir ideas. */}
                    <div className="col-md-4">
                        <article className="card h-100 text-center">
                            <div className="card-body p-4">
                                <div className="fs-1 mb-3" aria-hidden="true">
                                    💡
                                </div>

                                <h3 className="h5">Compartir ideas</h3>

                                <p>
                                    Publique sus iniciativas y dé a conocer
                                    propuestas que puedan beneficiar
                                    a otras personas.
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* Tarjeta para colaborar. */}
                    <div className="col-md-4">
                        <article className="card h-100 text-center">
                            <div className="card-body p-4">
                                <div className="fs-1 mb-3" aria-hidden="true">
                                    🤝
                                </div>

                                <h3 className="h5">Colaborar</h3>

                                <p>
                                    Conecte con personas que tengan
                                    intereses y competencias similares
                                    para trabajar en equipo.
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* Tarjeta para desarrollar proyectos. */}
                    <div className="col-md-4">
                        <article className="card h-100 text-center">
                            <div className="card-body p-4">
                                <div className="fs-1 mb-3" aria-hidden="true">
                                    🚀
                                </div>

                                <h3 className="h5">Crear proyectos</h3>

                                <p>
                                    Convierta las iniciativas en proyectos
                                    colaborativos y desarrolle nuevas
                                    oportunidades.
                                </p>
                            </div>
                        </article>
                    </div>

                </div>
            </section>


            {/* SECCIÓN DE FUNCIONAMIENTO */}
            <section
                className="py-5"
                style={{ backgroundColor: "#FFFFFF" }}
            >
                <div className="container">

                    <h2 className="text-center mb-4">
                        ¿Cómo funciona?
                    </h2>

                    {/* Pasos para utilizar la plataforma. */}
                    <div className="row g-4 text-center">

                        {/* Primer paso. */}
                        <div className="col-md-4">
                            <div className="fs-2 fw-bold mb-2" style={{ color: "#16A6A1" }}>
                                01
                            </div>
                            <h3 className="h5">Regístrese</h3>
                            <p>
                                Cree su cuenta y complete sus datos
                                para formar parte de la comunidad.
                            </p>
                        </div>

                        {/* Segundo paso. */}
                        <div className="col-md-4">
                            <div className="fs-2 fw-bold mb-2" style={{ color: "#16A6A1" }}>
                                02
                            </div>
                            <h3 className="h5">Explore iniciativas</h3>
                            <p>
                                Descubra propuestas y encuentre
                                oportunidades relacionadas
                                con sus intereses.
                            </p>
                        </div>

                        {/* Tercer paso. */}
                        <div className="col-md-4">
                            <div className="fs-2 fw-bold mb-2" style={{ color: "#16A6A1" }}>
                                03
                            </div>
                            <h3 className="h5">Participe</h3>
                            <p>
                                Solicite unirse a una iniciativa
                                o publique una idea propia.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


            {/* SECCIÓN FINAL PARA INVITAR AL REGISTRO */}
            <section
                className="py-5 text-center"
                style={{ backgroundColor: "#E8F5F4" }}
            >
                <div className="container">

                    <h2 className="mb-3">
                        Su próxima gran idea comienza aquí
                    </h2>

                    <p className="mb-4">
                        Únase a una comunidad donde las ideas crecen en equipo.
                    </p>

                    {/* Abre el formulario de registro. */}
                    <button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={() => cambiarPagina("registro")}
                    >
                        Comenzar ahora
                    </button>

                </div>
            </section>

        </main>
    );
}

// Permite utilizar la página pública desde App.jsx.
export default InicioPublico;
