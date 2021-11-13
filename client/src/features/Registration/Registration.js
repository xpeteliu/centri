import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registration.css';

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
          <p>
            <label htmlFor="email">
              Email address
              <input id="email" type="email" name="email" required />
            </label>
          </p>
          <p>
            <label htmlFor="password">
              Password
              <input id="password" type="password" name="password" requiredc />
            </label>
          </p>
          <p>
            <Button variant="secondary">Register</Button>
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
