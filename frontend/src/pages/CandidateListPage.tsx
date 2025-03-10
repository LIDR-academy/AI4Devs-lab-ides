import React from 'react';
import { Container } from '@mui/material';
import CandidateList from '../components/recruiter/CandidateList';
import Navbar from '../components/common/Navbar';

const CandidateListPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CandidateList />
      </Container>
    </>
  );
};

export default CandidateListPage; 