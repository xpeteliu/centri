import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="main-title home-page-title">Welcome to Our App</h1>
      <Link to="/">
        <button type="button" className="primary-button">Log out</button>
      </Link>
    </div>
  );
}
