import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Card, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showModal } from '../common/MessageModal/modalSlice';
import { postLogin } from './fetch';
import { setUserId } from '../common/userSlice';

export default function SignInPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    postLogin(
      document.getElementById('inputLoginUsername').value,
      document.getElementById('inputLoginPassword').value,
    )
      .then((resp) => resp.json())
      .then((body) => {
        if (body.code == null) {
          throw new Error('Network Error');
        }
        if (body.code === 0) {
          dispatch(setUserId(body.id));
          dispatch(showModal({
            headerText: 'Log In',
            bodyText: 'Successfully logged in!',
          }));
          history.push('/groups');
        } else {
          dispatch(showModal({
            headerText: 'Unable to Log In',
            bodyText: body.code === 2 ? 'User has been locked out. Try again later.' : 'Invalid username or password. Please try again.',
          }));
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
          <Card style={{ width: '35rem' }} className="mx-auto">
            <Card.Header>
              <h2>Sign In</h2>
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
                    <Form.Group className="mb-3 text-start" controlId="inputLoginUsername">
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
                    <Form.Group className="mb-3 text-start" controlId="inputLoginPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password here"
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="A password should contain >=8 characters and include both letters and numbers"
                        autoComplete="current-password"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{ marginTop: '1rem' }}>
                  <Col>
                    <Button variant="primary" type="submit" form="formLogin">Login</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer className="container">
              <Row className="text-center">
                <Col><Card.Link to="/register" as={Link}>Create an account</Card.Link></Col>
                <Col><Card.Link to="/resetPassword" as={Link}>Reset password</Card.Link></Col>
                <Col><Card.Link to="/" as={Link}>Back to Home Page</Card.Link></Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
