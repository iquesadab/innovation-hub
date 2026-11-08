function TarjetaIniciativa({ iniciativa, verDetalle }) {

    // Traduce los tipos a nombres más fáciles de leer.
    const nombresTipos = {
        idea: "Idea",
        necesidad: "Necesidad",
        reto: "Reto"
    };

    return (
        <article className="card h-100 shadow-sm">

            <div className="card-body d-flex flex-column">

                {/* Muestra el tipo y el estado de la iniciativa. */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge text-bg-primary">
                        {nombresTipos[iniciativa.tipo] || iniciativa.tipo}
                    </span>

                    <span className="badge text-bg-secondary">
                        {iniciativa.estado}
                    </span>
                </div>

                {/* Título de la iniciativa. */}
                <h2 className="h5 card-title">
                    {iniciativa.titulo}
                </h2>

                {/* Categoría a la que pertenece. */}
                <p className="small text-secondary mb-2">
                    Categoría: {iniciativa.categoria}
                </p>

                {/* Resumen de la iniciativa. */}
                <p className="card-text">
                    {iniciativa.resumen}
                </p>

                {/* Botón para consultar más información. */}
                <button
                    type="button"
                    className="btn btn-primary mt-auto"
                    onClick={() => verDetalle(iniciativa.id)}
                >
                    Ver detalle
                </button>

            </div>
        </article>
    );
}

// Permite importar la tarjeta desde el catálogo.
export default TarjetaIniciativa;