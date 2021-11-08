import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
  return (
    <div className="text-center m-5-auto">
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
          <button id="sub_btn" type="submit">Register</button>
        </p>
      </form>
      <footer>
        <p>
          <Link to="/">Back to Homepage</Link>
        </p>
      </footer>
    </div>
  );
}
