import React from "react"
import "./App.css"
import { Button } from "./components/ui/button"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World!</h1>
        <p>Benvenuto nella mia applicazione React con ShadCN/UI</p>

        {/* Pulsante standard */}
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#61dafb",
            border: "none",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          onClick={() => alert("Ciao! Grazie per aver cliccato!")}
        >
          Pulsante Standard
        </button>

        {/* Pulsante ShadCN/UI */}
        <div className="flex flex-col gap-4">
          <Button onClick={() => alert("Hai cliccato un pulsante ShadCN/UI!")}>
            Pulsante Default
          </Button>

          <Button
            variant="destructive"
            onClick={() => alert("Pulsante distruttivo!")}
          >
            Pulsante Destructive
          </Button>

          <Button variant="outline" onClick={() => alert("Pulsante outline!")}>
            Pulsante Outline
          </Button>

          <Button
            variant="secondary"
            onClick={() => alert("Pulsante secondario!")}
          >
            Pulsante Secondary
          </Button>
        </div>
      </header>
    </div>
  )
}

export default App
