import React from 'react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container className="h-100">
      <Row className="h-100">
        <Col className="my-auto">
          <div className="text-center">
            <h1>Welcome to Our App</h1>
            <Link to="/Login">
              <Button variant="primary">Sign In</Button>
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/register">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
