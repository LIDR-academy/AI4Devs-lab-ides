import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CandidateForm } from '../../components/candidates/CandidateForm';

export const AddCandidatePage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4 mb-4 text-center">Add New Candidate</h1>
          <CandidateForm />
        </Col>
      </Row>
    </Container>
  );
};