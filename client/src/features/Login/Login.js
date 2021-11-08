import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function SignInPage() {
  return (
    <div className="text-center m-5-auto">
      <h2>Sign In</h2>
      <form action="/home">
        <p>
          <label htmlFor="first_name">
            Username or email address
            <input id="first_name" type="text" name="first_name" required />
          </label>
        </p>
        <p>
          <label htmlFor="password">
            Password
            <input id="password" type="password" name="password" required />
          </label>
        </p>
        <p>
          <button id="sub_btn" type="submit">Login</button>
        </p>
      </form>
      <footer>
        <p>New user?</p>
        <p><Link to="/register">Create an account</Link></p>
        <p><Link to="/">Back to Homepage</Link></p>
      </footer>
    </div>
  );
}
