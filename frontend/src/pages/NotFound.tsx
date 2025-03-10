import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body className="p-5">
              <h1 className="display-1 text-danger">404</h1>
              <h2 className="mb-4">Página no encontrada</h2>
              <p className="lead mb-4">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
              </p>
              <Link to="/">
                <Button variant="primary" size="lg">
                  <i className="bi bi-house-door me-2"></i>
                  Volver al Inicio
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound; 