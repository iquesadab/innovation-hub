import { useState } from "react"; // Permite guardar información que cambia.

import Encabezado from "./componentes/layout/Encabezado.jsx"; // Menú superior.
import PiePagina from "./componentes/layout/PiePagina.jsx"; // Pie de página.
import Inicio from "./paginas/Inicio.jsx"; // Página principal.
import Login from "./paginas/Login.jsx"; // Formulario de inicio de sesión.
import Catalogo from "./paginas/Catalogo.jsx"; // Catálogo de iniciativas.

function App() {

    // Guarda los datos del usuario y su token.
    const [sesion, setSesion] = useState(null);

    // Guarda la página que estamos mostrando.
    const [pagina, setPagina] = useState("inicio");

    // Recibe los datos cuando el usuario inicia sesión.
    function manejarInicioSesion(resultado) {
        setSesion({
            token: resultado.token,
            usuario: resultado.usuario
        });

        setPagina("inicio"); // Regresa a la página principal.
    }

    // Elimina la sesión del usuario.
    function cerrarSesion() {
        setSesion(null);
        setPagina("inicio");
    }

    // Cambia la página seleccionada.
    function cambiarPagina(nuevaPagina) {
        setPagina(nuevaPagina);
    }

    // Selecciona el contenido según la página actual.
    function mostrarPagina() {

        // Muestra la página principal.
        if (pagina === "inicio") {
            return <Inicio />;
        }

        // Muestra el formulario de inicio de sesión.
        if (pagina === "login" && !sesion) {
            return <Login alIniciarSesion={manejarInicioSesion} />;
        }

        // Muestra el catálogo solo si existe una sesión.
        if (pagina === "iniciativas" && sesion) {
            return <Catalogo />;
        }

        // Evita mostrar páginas que todavía no están disponibles.
        return <Inicio />;
    }

    return (
        <>
            {/* Muestra el menú según el estado de la sesión. */}
            <Encabezado
                sesion={sesion}
                pagina={pagina}
                cambiarPagina={cambiarPagina}
                cerrarSesion={cerrarSesion}
            />

            {/* Muestra la página seleccionada. */}
            {mostrarPagina()}

            {/* Muestra el pie de página. */}
            <PiePagina />
        </>
    );
}

export default App; // Permite utilizar App desde main.jsx.