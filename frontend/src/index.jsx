import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./App.css"
import "./index.css"

// Importar estilos si existen
try {
  require("./styles/app.css")
  require("./styles/form.css")
  require("./styles/reset.css")
  require("./styles/responsive.css")
  require("./styles/toast.css")
  require("./styles/variables.css")
} catch (e) {
  console.log("Some style files might be missing, but that's ok")
}

const root = createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
