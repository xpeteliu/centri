import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Card, Col, Container, Form, Row,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { showModal } from '../common/MessageModal/modalSlice';
import { findUser, resetPassword } from './fetch';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    findUser(
      document.getElementById('inputResetUsername').value,
      document.getElementById('inputResetEmail').value,
    )
      .then((resp) => {
        if (resp.status !== 200) {
          throw new Error('Invalid response');
        }
        return resp.json();
      })
      .then((data) => {
        if (data.length === 0) {
          dispatch(showModal({
            headerText: 'Unable to Reset Password',
            bodyText: 'Cannot verify the user. Please try again.',
          }));
          return null;
        }
        return resetPassword(data[0]._id, document.getElementById('inputResetPassword').value);
      })
      .then((resp) => {
        if (resp) {
          if (resp.status !== 200 && resp.status !== 204) {
            throw new Error('Invalid response');
          }
          dispatch(showModal({
            headerText: 'Reset Password',
            bodyText: 'Successfully reset the password! Please log in now.',
          }));
          history.push('/login');
        }
      })
      .catch(() => {
        dispatch(showModal({
          headerText: 'Network Error',
          bodyText: 'Unable to connect to the server. Please try again later.',
        }));
      });
    event.preventDefault();
  };

  return (
    <Container className="h-100">
      <Row className="h-100">
        <Col className="my-auto">
          <Card style={{ width: '30rem' }} className="mx-auto">
            <Card.Header>
              <h2>Reset Password</h2>
            </Card.Header>
            <Card.Body>
              <Form
                id="formLogin"
                style={{ width: '25rem' }}
                className="container"
                onSubmit={handleSubmit}
              >
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputResetUsername">
                      <Form.Label className="ms-0">Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username here"
                        autoComplete="username"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputResetEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email here"
                        autoComplete="email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputResetPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password here"
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="A password should contain >=8 characters and include both letters and numbers"
                        autoComplete="new-password"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{ marginTop: '1rem' }}>
                  <Col>
                    <Button variant="primary" type="submit" form="formLogin">Reset</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer className="container">
              <Row className="text-center">
                <Col><Card.Link to="/login" as={Link}>Already have an account?</Card.Link></Col>
                <Col><Card.Link to="/" as={Link}>Back to Home Page</Card.Link></Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
