import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Card, Col, Container, Form, Row,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { showModal } from '../common/MessageModal/modalSlice';
import { postUser } from './fetch';

export default function SignUpPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    const password = document.getElementById('inputRegistrationPassword0').value;
    if (password === document.getElementById('inputRegistrationPassword1').value) {
      postUser(
        document.getElementById('inputRegistrationUsername').value,
        document.getElementById('inputRegistrationEmail').value,
        password,
      )
        .then((resp) => {
          switch (resp.status) {
            case 200:
              dispatch(showModal({
                headerText: 'Register',
                bodyText: 'Successfully registered a new user! Please log in now.',
              }));
              history.push('/login');
              break;
            case 409:
              dispatch(showModal({
                headerText: 'Unable to Register',
                bodyText: 'The username has been used. Please try another.',
              }));
              break;
            default:
              throw new Error('Invalid response');
          }
        })
        .catch(() => {
          dispatch(showModal({
            headerText: 'Network Error',
            bodyText: 'Unable to connect to the server. Please try again later.',
          }));
        });
    } else {
      dispatch(showModal({
        headerText: 'Invalid Input',
        bodyText: 'The passwords do not match.',
      }));
    }
    event.preventDefault();
  };

  return (
    <Container className="h-100">
      <Row className="h-100">
        <Col className="my-auto">
          <Card style={{ width: '30rem' }} className="mx-auto">
            <Card.Header>
              <h2>Sign Up</h2>
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
                    <Form.Group className="mb-3 text-start" controlId="inputRegistrationUsername">
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
                    <Form.Group className="mb-3 text-start" controlId="inputRegistrationEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email here"
                        autoComplete="email"
                        required
                      />
                      <Form.Text className="text-muted">
                        Your email will be kept confidential with us.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputRegistrationPassword0">
                      <Form.Label>Password</Form.Label>
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
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputRegistrationPassword1">
                      <Form.Label>Verify Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter the same password as above"
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
                    <Button variant="primary" type="submit" form="formLogin">Register</Button>
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
