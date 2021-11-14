import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SignUpPage() {
  return (
    <Card>
      <Card.Body>
        <h2>Join us</h2>
        <h5>Create your personal account</h5>
        <form action="/home">
          <p>
            <label htmlFor="first_name">
              Username
              <input id="first_name" type="text" name="first_name" required />
            </label>
          </p>
          <Form.Group className="mb-3" controlId="inputRegistrationEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email here" />
            <Form.Text className="text-muted">
              Your email will be kept confidential with us.
            </Form.Text>
          </Form.Group>
          <p>
            <label htmlFor="password">
              Password
              <input id="password" type="password" name="password" required />
            </label>
          </p>
          <p>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                console.log(document.querySelector(':invalid'));
              }}
            >
              Register
            </Button>
          </p>
        </form>
        <footer>
          <p>
            <Link to="/">Back to Homepage</Link>
          </p>
        </footer>
      </Card.Body>
    </Card>
  );
}
