import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./estilos.css";
import App from "./App.jsx";

// Inicia la aplicación React.
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);