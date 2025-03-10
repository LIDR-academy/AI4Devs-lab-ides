import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import CandidateForm from "../components/CandidateForm";
import { Link } from "react-router-dom";

const AddCandidatePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sistema de Seguimiento de Talento
          </Typography>
          <Button component={Link} to="/" variant="outlined" color="primary">
            Volver al Dashboard
          </Button>
        </Box>
        <CandidateForm />
      </Box>
    </Container>
  );
};

export default AddCandidatePage;
