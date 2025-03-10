import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Candidate } from "../types";
import { candidateService } from "../services/api";

const HomePage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await candidateService.getAll();
        setCandidates(data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener candidatos:", err);
        setError(
          "Error al cargar los candidatos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard de Reclutamiento
          </Typography>
          <Button
            component={Link}
            to="/add-candidate"
            variant="contained"
            color="primary"
            size="large"
          >
            Añadir Candidato
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Candidatos Recientes
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : candidates.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay candidatos registrados. ¡Añade tu primer candidato!
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Nombre</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Teléfono</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Educación</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Fecha</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>{`${candidate.firstName} ${candidate.lastName}`}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.phone || "N/A"}</TableCell>
                      <TableCell>{candidate.education || "N/A"}</TableCell>
                      <TableCell>
                        {candidate.createdAt
                          ? new Date(candidate.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
