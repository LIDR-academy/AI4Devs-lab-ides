import React from "react"
import "./App.css"
import Layout from "./components/layout/Layout"
import { Button } from "./components/ui/button"

function App() {
  return (
    <Layout>
      <div className="App">
        <header className="App-header">
          <h1>Hello World!</h1>
          <p>Benvenuto nella mia applicazione React con ShadCN/UI</p>

          <div className="flex flex-col gap-4 items-center">
            {/* Bottoni shadcn/ui con diversi stili */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link Style</Button>
            </div>

            {/* Bottone con icona */}
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              GitHub
            </Button>

            {/* Bottone con stato di caricamento */}
            <Button disabled className="mt-4">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Please wait
            </Button>
          </div>
        </header>
      </div>
    </Layout>
  )
}

export default App
