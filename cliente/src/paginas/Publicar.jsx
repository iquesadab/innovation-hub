import { useState } from "react";

import { crearIniciativa } from "../servicios/iniciativas.api.js";

function Publicar({ token, alPublicar }) {

    // Guarda los datos que escribe el usuario.
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [resumen, setResumen] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [problema, setProblema] = useState("");
    const [beneficiarios, setBeneficiarios] = useState("");
    const [competencias, setCompetencias] = useState("");
    const [miembrosEstimados, setMiembrosEstimados] = useState("1");
    const [visibilidad, setVisibilidad] = useState("publica");
    const [etiquetas, setEtiquetas] = useState("");

    // Controla los errores y el estado del formulario.
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    // Convierte un texto separado por comas en una lista.
    function convertirLista(texto) {
        return texto
            .split(",")
            .map((valor) => valor.trim())
            .filter((valor) => valor !== "");
    }

    // Comprueba que una lista cumpla las reglas del backend.
    function validarLista(lista, nombre) {

        // Permite un máximo de 20 elementos.
        if (lista.length > 20) {
            return `El campo ${nombre} permite máximo 20 elementos.`;
        }

        // Cada elemento debe tener entre 2 y 50 caracteres.
        if (lista.some((valor) => valor.length < 2 || valor.length > 50)) {
            return `Cada elemento de ${nombre} debe tener entre 2 y 50 caracteres.`;
        }

        // Comprueba que no existan elementos repetidos.
        const unicos = new Set(
            lista.map((valor) => valor.toLowerCase())
        );

        if (unicos.size !== lista.length) {
            return `No puede repetir elementos en ${nombre}.`;
        }

        return "";
    }

    // Valida y envía el formulario al backend.
    async function manejarEnvio(evento) {
        evento.preventDefault();
        setError("");

        // Elimina espacios innecesarios.
        const tituloLimpio = titulo.trim();
        const categoriaLimpia = categoria.trim();
        const resumenLimpio = resumen.trim();
        const descripcionLimpia = descripcion.trim();
        const problemaLimpio = problema.trim();
        const beneficiariosLimpios = beneficiarios.trim();

        // Convierte competencias y etiquetas en arreglos.
        const listaCompetencias = convertirLista(competencias);
        const listaEtiquetas = convertirLista(etiquetas);

        // Valida los campos obligatorios.
        if (
            !tituloLimpio ||
            !tipo ||
            !categoriaLimpia ||
            !resumenLimpio ||
            !descripcionLimpia
        ) {
            setError("Complete todos los campos obligatorios.");
            return;
        }

        // Comprueba los límites de los textos.
        if (tituloLimpio.length < 3 || tituloLimpio.length > 150) {
            setError("El título debe tener entre 3 y 150 caracteres.");
            return;
        }

        if (categoriaLimpia.length < 2 || categoriaLimpia.length > 100) {
            setError("La categoría debe tener entre 2 y 100 caracteres.");
            return;
        }

        if (resumenLimpio.length < 10 || resumenLimpio.length > 500) {
            setError("El resumen debe tener entre 10 y 500 caracteres.");
            return;
        }

        if (descripcionLimpia.length < 10 || descripcionLimpia.length > 5000) {
            setError("La descripción debe tener entre 10 y 5000 caracteres.");
            return;
        }

        if (problemaLimpio.length > 3000) {
            setError("El problema no puede superar 3000 caracteres.");
            return;
        }

        if (beneficiariosLimpios.length > 1000) {
            setError("Los beneficiarios no pueden superar 1000 caracteres.");
            return;
        }

        // Comprueba la cantidad estimada de integrantes.
        const cantidadMiembros = Number(miembrosEstimados);

        if (
            !Number.isSafeInteger(cantidadMiembros) ||
            cantidadMiembros < 1 ||
            cantidadMiembros > 1000
        ) {
            setError("Indique entre 1 y 1000 integrantes estimados.");
            return;
        }

        // Comprueba las listas de competencias y etiquetas.
        const errorCompetencias = validarLista(
            listaCompetencias,
            "competencias"
        );

        if (errorCompetencias) {
            setError(errorCompetencias);
            return;
        }

        const errorEtiquetas = validarLista(
            listaEtiquetas,
            "etiquetas"
        );

        if (errorEtiquetas) {
            setError(errorEtiquetas);
            return;
        }

        // Prepara los datos que acepta el backend.
        const nuevaIniciativa = {
            titulo: tituloLimpio,
            tipo,
            categoria: categoriaLimpia,
            resumen: resumenLimpio,
            descripcion: descripcionLimpia,
            problema: problemaLimpio,
            beneficiarios: beneficiariosLimpios,
            competencias: listaCompetencias,
            miembrosEstimados: cantidadMiembros,
            visibilidad,
            etiquetas: listaEtiquetas
        };

        setGuardando(true);

        try {
            // Guarda la iniciativa en MongoDB.
            const iniciativaCreada = await crearIniciativa(
                token,
                nuevaIniciativa
            );

            // Informa a App.jsx que se publicó correctamente.
            alPublicar(iniciativaCreada);

        } catch (error) {

            // Muestra el mensaje recibido desde el backend.
            setError(error.message);

        } finally {

            // Habilita nuevamente el botón de publicación.
            setGuardando(false);
        }
    }

    return (
        <main className="container py-5">

            {/* Título y descripción del formulario. */}
            <section className="mb-4">
                <h1>Publicar iniciativa</h1>
                <p>
                    Comparta una idea, necesidad o reto con
                    la comunidad de Innovation Hub.
                </p>
            </section>

            <section className="card">
                <div className="card-body p-4">

                    {/* Muestra los errores de validación. */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={manejarEnvio} noValidate>

                        <div className="row g-3">

                            {/* Título de la iniciativa. */}
                            <div className="col-md-8">
                                <label htmlFor="titulo" className="form-label">
                                    Título *
                                </label>

                                <input
                                    id="titulo"
                                    type="text"
                                    className="form-control"
                                    value={titulo}
                                    maxLength={150}
                                    onChange={(evento) =>
                                        setTitulo(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Tipo de iniciativa. */}
                            <div className="col-md-4">
                                <label htmlFor="tipo" className="form-label">
                                    Tipo *
                                </label>

                                <select
                                    id="tipo"
                                    className="form-select"
                                    value={tipo}
                                    onChange={(evento) =>
                                        setTipo(evento.target.value)
                                    }
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="idea">Idea</option>
                                    <option value="necesidad">Necesidad</option>
                                    <option value="reto">Reto</option>
                                </select>
                            </div>

                            {/* Categoría de la iniciativa. */}
                            <div className="col-md-6">
                                <label htmlFor="categoria" className="form-label">
                                    Categoría *
                                </label>

                                <input
                                    id="categoria"
                                    type="text"
                                    className="form-control"
                                    value={categoria}
                                    maxLength={100}
                                    onChange={(evento) =>
                                        setCategoria(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Nivel de visibilidad. */}
                            <div className="col-md-6">
                                <label htmlFor="visibilidad" className="form-label">
                                    Visibilidad *
                                </label>

                                <select
                                    id="visibilidad"
                                    className="form-select"
                                    value={visibilidad}
                                    onChange={(evento) =>
                                        setVisibilidad(evento.target.value)
                                    }
                                >
                                    <option value="publica">Pública</option>
                                    <option value="institucional">Institucional</option>
                                    <option value="restringida">Restringida</option>
                                    <option value="privada">Privada</option>
                                </select>
                            </div>

                            {/* Resumen de la iniciativa. */}
                            <div className="col-12">
                                <label htmlFor="resumen" className="form-label">
                                    Resumen *
                                </label>

                                <textarea
                                    id="resumen"
                                    className="form-control"
                                    rows="3"
                                    value={resumen}
                                    maxLength={500}
                                    onChange={(evento) =>
                                        setResumen(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Descripción completa. */}
                            <div className="col-12">
                                <label htmlFor="descripcion" className="form-label">
                                    Descripción *
                                </label>

                                <textarea
                                    id="descripcion"
                                    className="form-control"
                                    rows="5"
                                    value={descripcion}
                                    maxLength={5000}
                                    onChange={(evento) =>
                                        setDescripcion(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Problema que busca resolver. */}
                            <div className="col-12">
                                <label htmlFor="problema" className="form-label">
                                    Problema que busca resolver
                                </label>

                                <textarea
                                    id="problema"
                                    className="form-control"
                                    rows="3"
                                    value={problema}
                                    maxLength={3000}
                                    onChange={(evento) =>
                                        setProblema(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Personas que se beneficiarían. */}
                            <div className="col-12">
                                <label htmlFor="beneficiarios" className="form-label">
                                    Beneficiarios
                                </label>

                                <textarea
                                    id="beneficiarios"
                                    className="form-control"
                                    rows="3"
                                    value={beneficiarios}
                                    maxLength={1000}
                                    onChange={(evento) =>
                                        setBeneficiarios(evento.target.value)
                                    }
                                />
                            </div>

                            {/* Competencias necesarias para participar. */}
                            <div className="col-md-6">
                                <label htmlFor="competencias" className="form-label">
                                    Competencias
                                </label>

                                <input
                                    id="competencias"
                                    type="text"
                                    className="form-control"
                                    placeholder="Ejemplo: JavaScript, Diseño"
                                    value={competencias}
                                    onChange={(evento) =>
                                        setCompetencias(evento.target.value)
                                    }
                                />

                                <div className="form-text">
                                    Separe cada competencia con una coma.
                                </div>
                            </div>

                            {/* Etiquetas para identificar la iniciativa. */}
                            <div className="col-md-6">
                                <label htmlFor="etiquetas" className="form-label">
                                    Etiquetas
                                </label>

                                <input
                                    id="etiquetas"
                                    type="text"
                                    className="form-control"
                                    placeholder="Ejemplo: Innovación, Educación"
                                    value={etiquetas}
                                    onChange={(evento) =>
                                        setEtiquetas(evento.target.value)
                                    }
                                />

                                <div className="form-text">
                                    Separe cada etiqueta con una coma.
                                </div>
                            </div>

                            {/* Cantidad estimada de integrantes. */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="miembrosEstimados"
                                    className="form-label"
                                >
                                    Integrantes estimados *
                                </label>

                                <input
                                    id="miembrosEstimados"
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    max="1000"
                                    step="1"
                                    value={miembrosEstimados}
                                    onChange={(evento) =>
                                        setMiembrosEstimados(evento.target.value)
                                    }
                                />
                            </div>

                        </div>

                        {/* Botón para enviar el formulario. */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={guardando}
                            >
                                {guardando
                                    ? "Publicando..."
                                    : "Publicar iniciativa"}
                            </button>
                        </div>

                    </form>
                </div>
            </section>
        </main>
    );
}

// Permite importar el formulario desde App.jsx.
export default Publicar;
