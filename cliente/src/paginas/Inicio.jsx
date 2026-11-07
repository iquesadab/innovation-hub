function Inicio() {
    return (
        <main className="container py-4">

            {/* Sección de bienvenida */}
            <section className="card border-0 mb-4">
                <div className="card-body p-4">
                    <div className="row align-items-center g-4">

                        <div className="col-md-8">
                            <span className="badge text-bg-primary mb-3">
                                Universidad CENFOTEC
                            </span>

                            <h1>Innovation Hub</h1>

                            <p>
                                Un espacio para compartir ideas, identificar
                                necesidades y enfrentar retos mediante la
                                colaboración.
                            </p>

                            <div className="d-flex gap-2 flex-wrap">
                                <a href="#iniciativas" className="btn btn-primary">
                                    Explorar iniciativas
                                </a>

                                <a href="#publicar" className="btn btn-outline-primary">
                                    Publicar iniciativa
                                </a>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card text-center shadow-none h-100">
                                <div className="card-body">
                                    <div className="fs-2" aria-hidden="true">
                                        💡
                                    </div>

                                    <h2 className="h5">
                                        Personas + Ideas + Impacto
                                    </h2>

                                    <p className="small mb-0">
                                        Las grandes ideas comienzan con
                                        un primer paso.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Explicación de Innovation Hub */}
            <section className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-3 text-center fs-2" aria-hidden="true">
                            💬
                        </div>

                        <div className="col-md-9">
                            <h2 className="h5">¿Qué es Innovation Hub?</h2>

                            <p className="mb-0">
                                Innovation Hub es un espacio donde las personas
                                pueden publicar iniciativas y encontrar
                                oportunidades para colaborar con otros.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explicación de cómo funciona */}
            <section className="mb-4" aria-labelledby="tituloFuncionamiento">

                <div className="text-center mb-4">
                    <h2 id="tituloFuncionamiento">¿Cómo funciona?</h2>
                    <p>Explora, comparte y colabora con otras personas.</p>
                </div>

                <div className="row g-3">

                    <div className="col-md-4">
                        <article className="card h-100">
                            <div className="card-body">
                                <div className="fs-2 mb-3" aria-hidden="true">🔎</div>

                                <span className="badge text-bg-primary mb-2">
                                    Explora
                                </span>

                                <h3 className="h5">Descubre iniciativas</h3>

                                <p>
                                    Explora las iniciativas disponibles,
                                    conoce sus detalles y encuentra aquellas
                                    en las que puedes aportar tus conocimientos.
                                </p>

                                <a href="#iniciativas" className="btn btn-outline-primary">
                                    Explorar iniciativas
                                </a>
                            </div>
                        </article>
                    </div>

                    <div className="col-md-4">
                        <article className="card h-100">
                            <div className="card-body">
                                <div className="fs-2 mb-3" aria-hidden="true">💡</div>

                                <span className="badge text-bg-secondary mb-2">
                                    Comparte
                                </span>

                                <h3 className="h5">Publica una iniciativa</h3>

                                <p>
                                    Comparte una idea, necesidad o reto y
                                    encuentra personas con las competencias
                                    necesarias para desarrollarla.
                                </p>

                                <a href="#publicar" className="btn btn-primary">
                                    Publicar iniciativa
                                </a>
                            </div>
                        </article>
                    </div>

                    <div className="col-md-4">
                        <article className="card h-100">
                            <div className="card-body">
                                <div className="fs-2 mb-3" aria-hidden="true">🤝</div>

                                <span className="badge text-bg-success mb-2">
                                    Colabora
                                </span>

                                <h3 className="h5">Participa y colabora</h3>

                                <p>
                                    Explora las iniciativas publicadas y
                                    encuentra una oportunidad en la que
                                    puedas contribuir con tus competencias.
                                </p>

                                <a href="#iniciativas" className="btn btn-outline-primary">
                                    Encontrar oportunidades
                                </a>
                            </div>
                        </article>
                    </div>

                </div>
            </section>

            {/* Mensaje final */}
            <section className="card border-0 text-center">
                <div className="card-body p-4">

                    <span className="badge text-bg-secondary mb-3">
                        Innovation Hub
                    </span>

                    <h2 className="h4">
                        Una idea puede convertirse en una oportunidad
                    </h2>

                    <p>
                        Compártela con quienes creen en mente o
                        encuentra una iniciativa en la que puedas contribuir.
                    </p>

                    <a href="#iniciativas" className="btn btn-primary">
                        Comenzar a explorar
                    </a>

                </div>
            </section>

        </main>
    );
}

export default Inicio;