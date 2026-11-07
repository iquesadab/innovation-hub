import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Importa Bootstrap y sus funcionalidades interactivas.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Importa los estilos originales de Innovation Hub.
import "./estilos.css";

import App from "./App.jsx";


// Inicia la aplicación React.
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);