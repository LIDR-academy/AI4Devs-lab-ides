import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CandidateForm from '../components/CandidateForm';

const AddCandidatePage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Candidate Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Add a new candidate to the recruitment system
        </Typography>
        <CandidateForm />
      </Box>
    </Container>
  );
};

export default AddCandidatePage; 