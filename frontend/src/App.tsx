import React from "react";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/Dashboard/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <ToastContainer position="top-right" autoClose={5000} />
      <Dashboard />
    </div>
  );
}

export default App;
