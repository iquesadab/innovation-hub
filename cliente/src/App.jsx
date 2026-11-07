import Encabezado from "./componentes/layout/Encabezado.jsx";

function App() {
    return (
        <>
            <Encabezado />

            <main className="container py-4">
                <h1>Bienvenido a Innovation Hub</h1>

                <p>
                    Explora iniciativas, participa en proyectos
                    y comparte tus ideas.
                </p>
            </main>
        </>
    );
}

export default App;