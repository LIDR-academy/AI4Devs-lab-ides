import React from 'react';
import { Container } from '@mui/material';
import CandidateForm from '../components/recruiter/CandidateForm';
import Navbar from '../components/common/Navbar';

const AddCandidate: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CandidateForm />
      </Container>
    </>
  );
};

export default AddCandidate; 