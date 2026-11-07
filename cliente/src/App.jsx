import Encabezado from "./componentes/layout/Encabezado.jsx";
import PiePagina from "./componentes/layout/PiePagina.jsx";
import Inicio from "./paginas/Inicio.jsx";

function App() {
    return (
        <>
            {/* Encabezado general */}
            <Encabezado />

            {/* Página principal */}
            <Inicio />

            {/* Pie de página general */}
            <PiePagina />
        </>
    );
}

export default App;