import { useState } from "react"; // Permite guardar información que cambia.

import Encabezado from "./componentes/layout/Encabezado.jsx"; // Menú privado.
import EncabezadoPublico from "./componentes/layout/EncabezadoPublico.jsx"; // Menú público.
import PiePagina from "./componentes/layout/PiePagina.jsx"; // Pie de página.

import Inicio from "./paginas/Inicio.jsx"; // Inicio para usuarios autenticados.
import InicioPublico from "./paginas/InicioPublico.jsx"; // Inicio para visitantes.
import Login from "./paginas/Login.jsx"; // Formulario de inicio de sesión.
import Registro from "./paginas/Registro.jsx"; // Formulario de registro
import Catalogo from "./paginas/Catalogo.jsx"; // Página del catálogo de iniciativas


function App() {

    // Guarda los datos del usuario y su token.
    const [sesion, setSesion] = useState(null);

    // Guarda la página que estamos mostrando.
    const [pagina, setPagina] = useState("inicio");

    //  Guarda mensajes informativos.
    const [mensaje, setMensaje] = useState("");

    // Recibe los datos cuando el usuario inicia sesión.
    function manejarInicioSesion(resultado) {
        setSesion({
            token: resultado.token,
            usuario: resultado.usuario
        });

        setMensaje("");
        setPagina("inicio"); // Regresa a la página principal.
    }

    // Elimina la sesión del usuario.
    function cerrarSesion() {
        setSesion(null);
        setMensaje("");
        setPagina("inicio");
    }

    // Cambia la página seleccionada.
    function cambiarPagina(nuevaPagina) {
        setMensaje("");
        setPagina(nuevaPagina);
    }

    // Se ejecuta cuando el registro termina correctamente.
    function manejarRegistro() {
        setMensaje("Cuenta creada correctamente. Ahora puede iniciar sesión.");
        setPagina("login");
    }

    // Selecciona qué componente debe mostrar React según la página actual
    function mostrarPagina() {

        // Muestra un inicio diferente según exista una sesión.
        if (pagina === "inicio") {
            return sesion
                ? <Inicio />
                : <InicioPublico cambiarPagina={cambiarPagina} />;
        }

        // Muestra el login únicamente para visitantes.
        if (pagina === "login" && !sesion) {
            return <Login alIniciarSesion={manejarInicioSesion} />;
        }

        // El registro solamente aparece para visitantes.
        if (pagina === "registro" && !sesion) {
            return (
                <Registro
                    alRegistrarse={manejarRegistro}
                    irALogin={() => cambiarPagina("login")}
                />
            );
        }

        // Muestra el catálogo únicamente si el usuario inició sesión.
        if (pagina === "iniciativas" && sesion) {
            return (
                <Catalogo
                    token={sesion.token}
                    verDetalle={(id) => {
                        // Temporalmente muestra el ID seleccionado.
                        console.log("Iniciativa seleccionada:", id);
                    }}
                />
            );
        }

        // Muestra el catálogo solamente si existe una sesión.
        if (pagina === "iniciativas" && sesion) {
            return (
                <Catalogo
                    token={sesion.token}
                    verDetalle={(id) => {
                        // Temporalmente muestra el ID seleccionado.
                        // Después lo conectaremos con Detalle.jsx.
                        console.log("Iniciativa seleccionada:", id);
                    }}
                />
            );
        }

        // Evita mostrar páginas que todavía no están disponibles.
        return sesion
            ? <Inicio />
            : <InicioPublico cambiarPagina={cambiarPagina} />;
    }

    return (
        <>
            {/* Selecciona el encabezado según la sesión del usuario. */}
            {sesion ? (
                <Encabezado
                    pagina={pagina}
                    cambiarPagina={cambiarPagina}
                    cerrarSesion={cerrarSesion}
                />
            ) : (
                <EncabezadoPublico
                    pagina={pagina}
                    cambiarPagina={cambiarPagina}
                />
            )}

            {/* Confirma que el registro se realizó correctamente. */}
            {mensaje && (
                <div className="container mt-3">
                    <div className="alert alert-success" role="status">
                        {mensaje}
                    </div>
                </div>
            )}

            {/* Muestra la página seleccionada. */}
            {mostrarPagina()}

            {/* Muestra el pie de página. */}
            <PiePagina />
        </>
    );
}

export default App; // Permite utilizar App desde main.jsx.