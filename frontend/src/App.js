import React from "react"
import "./App.css"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World!</h1>
        <p>Benvenuto nella mia applicazione React</p>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#61dafb",
            border: "none",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => alert("Ciao! Grazie per aver cliccato!")}
        >
          Clicca qui!
        </button>
      </header>
    </div>
  )
}

export default App
