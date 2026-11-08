import { useEffect, useState } from "react";

// Importamos las funciones para consultar y actualizar iniciativas.
import {
    obtenerDetalleIniciativa,
    actualizarIniciativa
} from "../servicios/iniciativas.api.js";


// Página para editar una iniciativa existente.
function EditarIniciativa({
    token,
    iniciativaId,
    volverDetalle
}) {

    // Guarda la información de la iniciativa que queremos editar.
    const [iniciativa, setIniciativa] = useState(null);

    // Guarda las competencias como texto separado por comas.
    const [competencias, setCompetencias] = useState("");

    // Guarda las etiquetas como texto separado por comas.
    const [etiquetas, setEtiquetas] = useState("");

    // Indica si estamos consultando los datos de la iniciativa.
    const [cargando, setCargando] = useState(true);

    // Indica si estamos guardando los cambios.
    const [guardando, setGuardando] = useState(false);

    // Guarda los mensajes de error y confirmación.
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // Consulta la información de la iniciativa cuando se abre la página.
    useEffect(() => {

        // Evita actualizar el componente después de salir de la página.
        let cancelado = false;

        // Función que obtiene los datos actuales de la iniciativa.
        async function cargarIniciativa() {

            setCargando(true);
            setError("");

            try {

                // Consulta el detalle de la iniciativa en el backend.
                const resultado = await obtenerDetalleIniciativa(
                    token,
                    iniciativaId
                );

                if (!cancelado) {

                    // Guarda los datos para mostrarlos en el formulario.
                    setIniciativa(resultado);

                    // Convierte las listas en texto para los campos.
                    setCompetencias(
                        (resultado.competencias || []).join(", ")
                    );

                    setEtiquetas(
                        (resultado.etiquetas || []).join(", ")
                    );
                }

            } catch (error) {

                // Muestra el error si no se pudo consultar la iniciativa.
                if (!cancelado) {
                    setError(error.message);
                }

            } finally {

                // Finaliza la carga.
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargarIniciativa();

        // Limpieza cuando salimos de la página.
        return () => {
            cancelado = true;
        };

    }, [token, iniciativaId]);


    // Actualiza un campo del formulario cuando el usuario escribe.
    function cambiarCampo(campo, valor) {

        // Conserva los datos anteriores y cambia solamente un campo.
        setIniciativa((actual) => ({
            ...actual,
            [campo]: valor
        }));
    }


    // Convierte un texto separado por comas en una lista.
    function convertirLista(texto) {

        // Ejemplo: "React, JavaScript" pasa a ["React", "JavaScript"].
        return texto
            .split(",")
            .map((valor) => valor.trim())
            .filter((valor) => valor !== "");
    }


    // Guarda los cambios cuando el propietario envía el formulario.
    async function guardarCambios(evento) {

        // Evita que el navegador recargue la página.
        evento.preventDefault();

        // Limpia los mensajes anteriores.
        setError("");
        setMensaje("");

        // Comprueba que la iniciativa se haya cargado.
        if (!iniciativa) {
            setError("No se encontró la iniciativa.");
            return;
        }

        // Comprueba que los campos principales no estén vacíos.
        if (
            !iniciativa.titulo?.trim() ||
            !iniciativa.categoria?.trim() ||
            !iniciativa.resumen?.trim() ||
            !iniciativa.descripcion?.trim()
        ) {
            setError("Complete todos los campos obligatorios.");
            return;
        }

        // Convierte la cantidad de integrantes a número.
        const cantidadMiembros = Number(iniciativa.miembrosEstimados);

        // Comprueba que la cantidad sea un número entero positivo.
        if (
            !Number.isInteger(cantidadMiembros) ||
            cantidadMiembros < 1
        ) {
            setError("Ingrese una cantidad válida de integrantes.");
            return;
        }

        // Prepara los datos que vamos a enviar al backend.
        // No incluimos el ID ni el propietario porque no deben cambiar.
        const cambios = {
            titulo: iniciativa.titulo.trim(),
            tipo: iniciativa.tipo,
            categoria: iniciativa.categoria.trim(),
            resumen: iniciativa.resumen.trim(),
            descripcion: iniciativa.descripcion.trim(),
            problema: (iniciativa.problema || "").trim(),
            beneficiarios: (iniciativa.beneficiarios || "").trim(),
            competencias: convertirLista(competencias),
            miembrosEstimados: cantidadMiembros,
            visibilidad: iniciativa.visibilidad,
            etiquetas: convertirLista(etiquetas)
        };

        // Indica que comenzó el proceso de guardado.
        setGuardando(true);

        try {

            // Envía los cambios al backend utilizando el ID.
            await actualizarIniciativa(token, iniciativaId, cambios);

            // Muestra un mensaje si se guardaron correctamente.
            setMensaje("Iniciativa actualizada correctamente.");

        } catch (error) {

            // Muestra el error recibido desde el backend.
            setError(error.message);

        } finally {

            // Habilita nuevamente el botón de guardar.
            setGuardando(false);
        }
    }


    return (
        <main className="container py-5">

            {/* Botón para regresar al detalle de la iniciativa. */}
            <button
                type="button"
                className="btn btn-outline-primary mb-4"
                onClick={volverDetalle}
            >
                Volver al detalle
            </button>


            {/* Título principal de la página. */}
            <h1>Editar iniciativa</h1>

            <p>
                Modifique la información de su iniciativa
                y guarde los cambios.
            </p>


            {/* Mensaje mientras se consultan los datos. */}
            {cargando && (
                <p role="status">Cargando iniciativa...</p>
            )}


            {/* Muestra los errores de consulta o guardado. */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}


            {/* Muestra la confirmación cuando se guardan los cambios. */}
            {mensaje && (
                <div className="alert alert-success" role="status">
                    {mensaje}
                </div>
            )}


            {/* El formulario aparece cuando tenemos los datos. */}
            {!cargando && iniciativa && (

                <form
                    onSubmit={guardarCambios}
                    noValidate
                    className="card"
                >

                    <div className="card-body p-4">

                        {/* Bootstrap organiza los campos en columnas. */}
                        <div className="row g-3">


                            {/* Campo: título de la iniciativa. */}
                            <div className="col-md-8">

                                <label
                                    htmlFor="editarTitulo"
                                    className="form-label"
                                >
                                    Título
                                </label>

                                <input
                                    id="editarTitulo"
                                    className="form-control"
                                    value={iniciativa.titulo || ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "titulo",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>


                            {/* Campo: tipo de iniciativa. */}
                            <div className="col-md-4">

                                <label
                                    htmlFor="editarTipo"
                                    className="form-label"
                                >
                                    Tipo
                                </label>

                                <select
                                    id="editarTipo"
                                    className="form-select"
                                    value={iniciativa.tipo || "idea"}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "tipo",
                                            evento.target.value
                                        )
                                    }
                                >
                                    <option value="idea">Idea</option>
                                    <option value="necesidad">Necesidad</option>
                                    <option value="reto">Reto</option>
                                </select>
                            </div>


                            {/* Campo: categoría de la iniciativa. */}
                            <div className="col-md-6">

                                <label
                                    htmlFor="editarCategoria"
                                    className="form-label"
                                >
                                    Categoría
                                </label>

                                <input
                                    id="editarCategoria"
                                    className="form-control"
                                    value={iniciativa.categoria || ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "categoria",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>


                            {/* Campo: visibilidad de la iniciativa. */}
                            <div className="col-md-6">

                                <label
                                    htmlFor="editarVisibilidad"
                                    className="form-label"
                                >
                                    Visibilidad
                                </label>

                                <select
                                    id="editarVisibilidad"
                                    className="form-select"
                                    value={iniciativa.visibilidad || "publica"}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "visibilidad",
                                            evento.target.value
                                        )
                                    }
                                >
                                    <option value="publica">Pública</option>
                                    <option value="institucional">Institucional</option>
                                    <option value="restringida">Restringida</option>
                                    <option value="privada">Privada</option>
                                </select>
                            </div>


                            {/* Campo: resumen de la iniciativa. */}
                            <div className="col-12">

                                <label
                                    htmlFor="editarResumen"
                                    className="form-label"
                                >
                                    Resumen
                                </label>

                                <textarea
                                    id="editarResumen"
                                    className="form-control"
                                    rows="3"
                                    value={iniciativa.resumen || ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "resumen",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>


                            {/* Campo: descripción completa. */}
                            <div className="col-12">

                                <label
                                    htmlFor="editarDescripcion"
                                    className="form-label"
                                >
                                    Descripción
                                </label>

                                <textarea
                                    id="editarDescripcion"
                                    className="form-control"
                                    rows="5"
                                    value={iniciativa.descripcion || ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "descripcion",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>


                            {/* Campo: problema que busca resolver. */}
                            <div className="col-12">

                                <label
                                    htmlFor="editarProblema"
                                    className="form-label"
                                >
                                    Problema
                                </label>

                                <textarea
                                    id="editarProblema"
                                    className="form-control"
                                    rows="3"
                                    value={iniciativa.problema || ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "problema",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>


                            {/* Campo: personas que se beneficiarán. */}
                            <div className="col-12">

                                <label
                                    htmlFor="editarBeneficiarios"
                                    className="form-label"
                                >
                                    Beneficiarios
                                </label>

                                <textarea
                                    id="editarBeneficiarios"
                                    className="form-control"
                                    rows="3"
                                    value={iniciativa.beneficiarios || ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "beneficiarios",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>


                            {/* Campo: competencias necesarias. */}
                            <div className="col-md-6">

                                <label
                                    htmlFor="editarCompetencias"
                                    className="form-label"
                                >
                                    Competencias
                                </label>

                                <input
                                    id="editarCompetencias"
                                    className="form-control"
                                    placeholder="React, JavaScript"
                                    value={competencias}
                                    onChange={(evento) =>
                                        setCompetencias(evento.target.value)
                                    }
                                />

                                <div className="form-text">
                                    Separe las competencias con comas.
                                </div>
                            </div>


                            {/* Campo: etiquetas de la iniciativa. */}
                            <div className="col-md-6">

                                <label
                                    htmlFor="editarEtiquetas"
                                    className="form-label"
                                >
                                    Etiquetas
                                </label>

                                <input
                                    id="editarEtiquetas"
                                    className="form-control"
                                    placeholder="Tecnología, Ambiente"
                                    value={etiquetas}
                                    onChange={(evento) =>
                                        setEtiquetas(evento.target.value)
                                    }
                                />

                                <div className="form-text">
                                    Separe las etiquetas con comas.
                                </div>
                            </div>


                            {/* Campo: cantidad estimada de integrantes. */}
                            <div className="col-md-6">

                                <label
                                    htmlFor="editarMiembros"
                                    className="form-label"
                                >
                                    Integrantes estimados
                                </label>

                                <input
                                    id="editarMiembros"
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={iniciativa.miembrosEstimados ?? ""}
                                    onChange={(evento) =>
                                        cambiarCampo(
                                            "miembrosEstimados",
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>


                        {/* Botón que envía los cambios al backend. */}
                        <button
                            type="submit"
                            className="btn btn-primary mt-4"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>

                    </div>
                </form>
            )}

        </main>
    );
}


// Permite utilizar esta página desde App.jsx.
export default EditarIniciativa;