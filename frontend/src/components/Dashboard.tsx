import React from 'react';
import styled from 'styled-components';
import CandidateForm from './CandidateForm';
import CandidateList from './CandidateList';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Header>Dashboard</Header>
      
      <Section>
        <h2>Add New Candidate</h2>
        <CandidateForm />
      </Section>
      
      <Section>
        <CandidateList />
      </Section>
    </Container>
  );
};

export default Dashboard; 