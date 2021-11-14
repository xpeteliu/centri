import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Card, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { MessageModal } from '../common/MessageModal/MessageModal';
import { showModal } from '../common/MessageModal/modalSlice';
import { getLogin } from './fetch';

export default function SignInPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    getLogin(
      document.getElementById('inputLoginInfo').value,
      document.getElementById('inputLoginPassword').value,
    ).then((resp) => {
      if (resp.status === 401) {
        dispatch(showModal({ headerText: 'Unable to Log In', bodyText: 'Invalid username or password. Please try again.' }));
      } else {
        history.push('/');
      }
    }).catch(() => {
      dispatch(showModal({ headerText: 'Network Error', bodyText: 'Unable to connect to the server. Please try again later.' }));
    });
    event.preventDefault();
  };

  return (
    <Container className="h-100">
      <Row className="h-100">
        <Col className="my-auto">
          <Card style={{ width: '30rem' }} className="mx-auto">
            <Card.Header>
              <h2>Sign In</h2>
            </Card.Header>
            <Card.Body>
              <Form action="/action_page.php" id="formLogin" style={{ width: '25rem' }} className="container" onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputLoginInfo">
                      <Form.Label className="ms-0">Username</Form.Label>
                      <Form.Control type="text" placeholder="Enter username here" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3 text-start" controlId="inputLoginPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
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
                <Col><Card.Link to="/" as={Link}>Back to Home Page</Card.Link></Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <MessageModal />
    </Container>
  );
}
