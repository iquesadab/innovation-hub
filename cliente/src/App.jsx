
import { useState } from "react"; // Permite guardar información que cambia

// Componentes del diseño general.
import Encabezado from "./componentes/layout/Encabezado.jsx";
import EncabezadoPublico from "./componentes/layout/EncabezadoPublico.jsx";
import PiePagina from "./componentes/layout/PiePagina.jsx";

// Páginas que ya teníamos.
import Inicio from "./paginas/Inicio.jsx";
import InicioPublico from "./paginas/InicioPublico.jsx";
import Login from "./paginas/Login.jsx";
import Registro from "./paginas/Registro.jsx";
import Catalogo from "./paginas/Catalogo.jsx";
import Detalle from "./paginas/Detalle.jsx";
import Publicar from "./paginas/Publicar.jsx";
import Perfil from "./paginas/Perfil.jsx";

// Nuevas páginas para trabajar con solicitudes.
import SolicitarParticipacion from "./paginas/SolicitarParticipacion.jsx";
import MisSolicitudes from "./paginas/MisSolicitudes.jsx";
import GestionarSolicitudes from "./paginas/GestionarSolicitudes.jsx";

// Nueva página para editar iniciativas.
import EditarIniciativa from "./paginas/EditarIniciativa.jsx";


function App() {

    // Guarda los datos del usuario y su token.
    const [sesion, setSesion] = useState(null);

    // Guarda el nombre de la página que estamos mostrando.
    const [pagina, setPagina] = useState("inicio");

    // Guarda los mensajes informativos.
    const [mensaje, setMensaje] = useState("");

    // Guarda el ID de la iniciativa seleccionada.
    const [iniciativaSeleccionada, setIniciativaSeleccionada] = useState(null);


    // Recibe los datos cuando el usuario inicia sesión.
    function manejarInicioSesion(resultado) {

        // Guarda el token y la información del usuario.
        setSesion({
            token: resultado.token,
            usuario: resultado.usuario
        });

        // Limpia mensajes y regresa al inicio.
        setMensaje("");
        setPagina("inicio");
    }


    // Elimina la sesión del usuario.
    function cerrarSesion() {

        // Borra los datos de la sesión.
        setSesion(null);

        // Limpia la iniciativa seleccionada y los mensajes.
        setIniciativaSeleccionada(null);
        setMensaje("");

        // Regresa a la página pública.
        setPagina("inicio");
    }


    // Cambia la página que está mostrando React.
    function cambiarPagina(nuevaPagina) {

        // Limpia los mensajes anteriores.
        setMensaje("");

        // Guarda la página seleccionada.
        setPagina(nuevaPagina);
    }


    // Se ejecuta cuando el registro termina correctamente.
    function manejarRegistro() {

        // Muestra la confirmación y abre el login.
        setMensaje(
            "Cuenta creada correctamente. Ahora puede iniciar sesión."
        );

        setPagina("login");
    }


    // Guarda el ID de una iniciativa y abre su detalle.
    function abrirDetalle(id) {

        // Guarda la iniciativa seleccionada.
        setIniciativaSeleccionada(id);

        // Abre la página de detalle.
        cambiarPagina("detalle");
    }


    // Regresa al catálogo de iniciativas.
    function volverCatalogo() {
        cambiarPagina("iniciativas");
    }


    // Regresa al detalle de la iniciativa seleccionada.
    function volverDetalle() {
        cambiarPagina("detalle");
    }


    // Abre el formulario para solicitar participación.
    function abrirSolicitud() {
        cambiarPagina("solicitar");
    }


    // Abre las solicitudes recibidas por una iniciativa.
    function abrirGestionSolicitudes() {
        cambiarPagina("gestionarSolicitudes");
    }


    // Abre el formulario para editar la iniciativa seleccionada.
    function abrirEditarIniciativa() {
        cambiarPagina("editarIniciativa");
    }


    // Abre el detalle de la iniciativa que se acaba de publicar.
    function manejarPublicacion(iniciativa) {

        // Guarda el ID de la nueva iniciativa.
        setIniciativaSeleccionada(iniciativa.id);

        // Muestra un mensaje y abre el detalle.
        setMensaje("Iniciativa publicada correctamente.");
        setPagina("detalle");
    }


    // Actualiza los datos del usuario guardados en la sesión.
    function manejarActualizacionPerfil(usuarioActualizado) {

        // Conserva el token y reemplaza los datos del usuario.
        setSesion((sesionActual) => ({
            ...sesionActual,
            usuario: usuarioActualizado
        }));
    }


    // Selecciona qué página debe mostrar React.
    function mostrarPagina() {

        // Inicio público o privado según exista una sesión.
        if (pagina === "inicio") {
            return sesion
                ? <Inicio />
                : <InicioPublico cambiarPagina={cambiarPagina} />;
        }


        // Login para visitantes.
        if (pagina === "login" && !sesion) {
            return (
                <Login alIniciarSesion={manejarInicioSesion} />
            );
        }


        // Registro para visitantes.
        if (pagina === "registro" && !sesion) {
            return (
                <Registro
                    alRegistrarse={manejarRegistro}
                    irALogin={() => cambiarPagina("login")}
                />
            );
        }


        // Catálogo de iniciativas.
        if (pagina === "iniciativas" && sesion) {
            return (
                <Catalogo
                    token={sesion.token}
                    verDetalle={abrirDetalle}
                />
            );
        }


        // Detalle de la iniciativa seleccionada.
        if (
            pagina === "detalle" &&
            sesion &&
            iniciativaSeleccionada
        ) {
            return (
                <Detalle
                    token={sesion.token}
                    iniciativaId={iniciativaSeleccionada}

                    // Identifica al usuario que inició sesión.
                    usuarioId={sesion.usuario.id}

                    // Navegación desde el detalle.
                    volverCatalogo={volverCatalogo}
                    irASolicitar={abrirSolicitud}
                    irAGestionar={abrirGestionSolicitudes}
                    irAEditar={abrirEditarIniciativa}
                />
            );
        }


        // Página para solicitar participación.
        if (
            pagina === "solicitar" &&
            sesion &&
            iniciativaSeleccionada
        ) {
            return (
                <SolicitarParticipacion
                    token={sesion.token}
                    iniciativaId={iniciativaSeleccionada}
                    volverDetalle={volverDetalle}
                />
            );
        }


        // Página para consultar las solicitudes propias.
        if (pagina === "misSolicitudes" && sesion) {
            return (
                <MisSolicitudes
                    token={sesion.token}
                />
            );
        }


        // Página para gestionar solicitudes recibidas.
        if (
            pagina === "gestionarSolicitudes" &&
            sesion &&
            iniciativaSeleccionada
        ) {
            return (
                <GestionarSolicitudes
                    token={sesion.token}
                    iniciativaId={iniciativaSeleccionada}
                    volverDetalle={volverDetalle}
                />
            );
        }


        // Página para editar la iniciativa seleccionada.
        if (
            pagina === "editarIniciativa" &&
            sesion &&
            iniciativaSeleccionada
        ) {
            return (
                <EditarIniciativa
                    token={sesion.token}
                    iniciativaId={iniciativaSeleccionada}
                    volverDetalle={volverDetalle}
                />
            );
        }


        // Formulario para publicar una iniciativa.
        if (pagina === "publicar" && sesion) {
            return (
                <Publicar
                    token={sesion.token}
                    alPublicar={manejarPublicacion}
                />
            );
        }


        // Perfil del usuario autenticado.
        if (pagina === "perfil" && sesion) {
            return (
                <Perfil
                    token={sesion.token}
                    alActualizarPerfil={manejarActualizacionPerfil}
                />
            );
        }

        // Página alternativa si la ruta no existe.
        return sesion
            ? <Inicio />
            : <InicioPublico cambiarPagina={cambiarPagina} />;
    }


    return (
        <>

            {/* Muestra el menú correspondiente a la sesión. */}
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


            {/* Mensajes generales del sistema. */}
            {mensaje && (
                <div className="container mt-3">
                    <div
                        className="alert alert-success"
                        role="status"
                    >
                        {mensaje}
                    </div>
                </div>
            )}


            {/* Muestra la página seleccionada. */}
            {mostrarPagina()}


            {/* Pie de página. */}
            <PiePagina />

        </>
    );
}


// Permite utilizar App desde main.jsx.
export default App;
