import React, { useState } from "react"
import "./App.css"
import Layout from "./components/layout/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table"

function App() {
  // Dati di esempio per i candidati
  const candidates = [
    { id: 1, name: "John Smith", email: "js@mail.com", status: "PENDING" },
    { id: 2, name: "Maria García", email: "mg@mail.com", status: "VALUATED" },
    { id: 3, name: "Alex Johnson", email: "aj@mail.com", status: "PENDING" },
    { id: 4, name: "Sarah Williams", email: "sw@mail.com", status: "VALUATED" },
    { id: 5, name: "David Brown", email: "db@mail.com", status: "PENDING" },
  ]

  // Calcolo delle statistiche
  const totalCandidates = candidates.length
  const pendingCandidates = candidates.filter(
    (c) => c.status === "PENDING"
  ).length
  const valuatedCandidates = candidates.filter(
    (c) => c.status === "VALUATED"
  ).length
  const todayReceivedCandidates = 2 // Esempio di valore statico

  // Stato per i tooltip
  const [activeTooltip, setActiveTooltip] = useState(null)

  // Stili per i pulsanti di azione
  const actionButtonStyle = {
    padding: "6px",
    marginRight: "4px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    position: "relative",
  }

  // Stile per il bottone Add Candidate
  const addButtonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }

  // Stile per i tooltip
  const tooltipStyle = {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    zIndex: 10,
    marginBottom: "5px",
  }

  return (
    <Layout>
      <div style={{ padding: "24px 0" }}>
        {/* Cards per le statistiche */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Candidates received today - Prima card */}
          <Card>
            <CardHeader>
              <CardTitle>Candidates received today</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#3b82f6",
                  margin: 0,
                }}
              >
                {todayReceivedCandidates}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#111827",
                  margin: 0,
                }}
              >
                {totalCandidates}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                  margin: 0,
                }}
              >
                {pendingCandidates}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valuated Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#10b981",
                  margin: 0,
                }}
              >
                {valuatedCandidates}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pulsante Add Candidate centrato */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <button style={addButtonStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Add Candidate
          </button>
        </div>

        {/* Tabella dei candidati */}
        <Card>
          <CardContent style={{ padding: "0" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead style={{ width: "120px" }}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            candidate.status === "PENDING"
                              ? "#fef3c7"
                              : "#d1fae5",
                          color:
                            candidate.status === "PENDING"
                              ? "#92400e"
                              : "#065f46",
                        }}
                      >
                        {candidate.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        {/* Edit button */}
                        <button
                          style={actionButtonStyle}
                          onMouseEnter={() =>
                            setActiveTooltip(`edit-${candidate.id}`)
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          {activeTooltip === `edit-${candidate.id}` && (
                            <div style={tooltipStyle}>Edit</div>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>

                        {/* Delete button */}
                        <button
                          style={actionButtonStyle}
                          onMouseEnter={() =>
                            setActiveTooltip(`delete-${candidate.id}`)
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          {activeTooltip === `delete-${candidate.id}` && (
                            <div style={tooltipStyle}>Delete</div>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>

                        {/* Download CSV button */}
                        <button
                          style={actionButtonStyle}
                          onMouseEnter={() =>
                            setActiveTooltip(`download-${candidate.id}`)
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          {activeTooltip === `download-${candidate.id}` && (
                            <div style={tooltipStyle}>Download CSV</div>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default App
