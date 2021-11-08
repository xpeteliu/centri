import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="home-page-title">Welcome to Our App</h1>
      <Link to="/Login">
        <Button variant="primary">Sign In</Button>
      </Link>
      <Link to="/register">
        <Button variant="secondary">Sign Up</Button>
      </Link>
    </div>
  );
}