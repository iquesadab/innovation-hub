import { useEffect, useState } from "react";

import { obtenerIniciativas } from "../servicios/iniciativas.api.js";
import TarjetaIniciativa from "../componentes/iniciativas/TarjetaIniciativa.jsx";

function Catalogo({ token, verDetalle }) {

    // Guarda las iniciativas recibidas desde MongoDB.
    const [iniciativas, setIniciativas] = useState([]);

    // Guarda los valores que escribe o selecciona el usuario.
    const [busqueda, setBusqueda] = useState("");
    const [tipo, setTipo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [competencia, setCompetencia] = useState("");

    // Guarda los filtros que realmente se enviarán al backend.
    const [filtros, setFiltros] = useState({});

    // Guarda la página actual y el total de iniciativas.
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);

    // Controla los mensajes y el estado de la consulta.
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Cantidad de iniciativas que mostraremos por página.
    const limite = 12;

    // Consulta MongoDB al abrir el catálogo o cambiar los filtros.
    useEffect(() => {

        // Evita actualizar la pantalla después de cancelar una consulta.
        let cancelado = false;

        async function cargarIniciativas() {

            setCargando(true);
            setError("");

            try {
                // Solicita las iniciativas con los filtros actuales.
                const resultado = await obtenerIniciativas(token, {
                    ...filtros,
                    page: pagina,
                    size: limite
                });

                // Guarda los datos solamente si la consulta sigue activa.
                if (!cancelado) {
                    setIniciativas(resultado.iniciativas);
                    setTotal(resultado.total);
                }

            } catch (error) {

                // Muestra el error recibido desde el backend.
                if (!cancelado) {
                    setError(error.message);
                    setIniciativas([]);
                    setTotal(0);
                }

            } finally {

                // Finaliza el estado de carga.
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargarIniciativas();

        // Cancela la actualización si cambia la consulta.
        return () => {
            cancelado = true;
        };

    }, [token, filtros, pagina]);

    // Aplica los filtros cuando se envía el formulario.
    function manejarBusqueda(evento) {
        evento.preventDefault();

        setPagina(1);

        setFiltros({
            q: busqueda.trim(),
            type: tipo,
            category: categoria.trim(),
            skill: competencia.trim()
        });
    }

    // Limpia todos los filtros del catálogo.
    function limpiarFiltros() {
        setBusqueda("");
        setTipo("");
        setCategoria("");
        setCompetencia("");
        setPagina(1);
        setFiltros({});
    }

    // Calcula cuántas páginas existen.
    const totalPaginas = Math.ceil(total / limite);

    return (
        <main className="container py-5">

            {/* Encabezado del catálogo. */}
            <section className="mb-4">
                <h1 className="mb-2">
                    Catálogo de iniciativas
                </h1>

                <p>
                    Explore las iniciativas registradas y encuentre
                    oportunidades para colaborar.
                </p>
            </section>

            {/* Formulario de búsqueda y filtros. */}
            <section className="card mb-4">
                <div className="card-body">

                    <h2 className="h5 mb-3">
                        Buscar iniciativas
                    </h2>

                    <form onSubmit={manejarBusqueda}>
                        <div className="row g-3">

                            {/* Busca por título o resumen. */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="buscarIniciativa"
                                    className="form-label"
                                >
                                    Buscar
                                </label>

                                <input
                                    id="buscarIniciativa"
                                    type="search"
                                    className="form-control"
                                    placeholder="Título o resumen"
                                    maxLength={100}
                                    value={busqueda}
                                    onChange={(evento) =>
                                        setBusqueda(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Filtra por tipo de iniciativa. */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="filtrarTipo"
                                    className="form-label"
                                >
                                    Tipo
                                </label>

                                <select
                                    id="filtrarTipo"
                                    className="form-select"
                                    value={tipo}
                                    onChange={(evento) =>
                                        setTipo(evento.target.value)
                                    }
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="idea">Idea</option>
                                    <option value="necesidad">Necesidad</option>
                                    <option value="reto">Reto</option>
                                </select>
                            </div>

                            {/* Filtra por categoría. */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="filtrarCategoria"
                                    className="form-label"
                                >
                                    Categoría
                                </label>

                                <input
                                    id="filtrarCategoria"
                                    type="text"
                                    className="form-control"
                                    placeholder="Ejemplo: Tecnología"
                                    maxLength={100}
                                    value={categoria}
                                    onChange={(evento) =>
                                        setCategoria(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Filtra por competencia. */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="filtrarCompetencia"
                                    className="form-label"
                                >
                                    Competencia
                                </label>

                                <input
                                    id="filtrarCompetencia"
                                    type="text"
                                    className="form-control"
                                    placeholder="Ejemplo: JavaScript"
                                    maxLength={100}
                                    value={competencia}
                                    onChange={(evento) =>
                                        setCompetencia(evento.target.value)
                                    }
                                />
                            </div>

                        </div>

                        {/* Botones para buscar y limpiar. */}
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Buscar
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={limpiarFiltros}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Muestra un mensaje mientras se consultan los datos. */}
            {cargando && (
                <p role="status">
                    Cargando iniciativas...
                </p>
            )}

            {/* Muestra los errores de conexión. */}
            {!cargando && error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Muestra un mensaje si no hay resultados. */}
            {!cargando && !error && iniciativas.length === 0 && (
                <div className="alert alert-info" role="status">
                    No se encontraron iniciativas con los filtros seleccionados.
                </div>
            )}

            {/* Muestra las iniciativas obtenidas desde MongoDB. */}
            {!cargando && !error && iniciativas.length > 0 && (
                <section aria-label="Resultados del catálogo">

                    {/* Cantidad total de resultados. */}
                    <p className="mb-3">
                        Iniciativas encontradas: {total}
                    </p>

                    {/* Organiza las tarjetas con Bootstrap. */}
                    <div className="row g-4">
                        {iniciativas.map((iniciativa) => (
                            <div
                                className="col-md-6 col-lg-4"
                                key={iniciativa.id}
                            >
                                <TarjetaIniciativa
                                    iniciativa={iniciativa}
                                    verDetalle={verDetalle}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Permite cambiar entre páginas de resultados. */}
                    {totalPaginas > 1 && (
                        <nav
                            className="d-flex justify-content-center align-items-center gap-3 mt-4"
                            aria-label="Paginación del catálogo"
                        >
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                disabled={pagina === 1}
                                onClick={() => setPagina(pagina - 1)}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {pagina} de {totalPaginas}
                            </span>

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                disabled={pagina >= totalPaginas}
                                onClick={() => setPagina(pagina + 1)}
                            >
                                Siguiente
                            </button>
                        </nav>
                    )}

                </section>
            )}

        </main>
    );
}

// Permite importar el catálogo desde App.jsx.
export default Catalogo;