import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

export default function SignInPage() {
  return (
    <div className="text-center m-5-auto">
      <h2>Sign In</h2>
      <form action="/home">
        <p>
          <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
          <label>Username or email address</label>
          {/* <br/> */}
          <input type="text" name="first_name" required />
        </p>
        <p>
          <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
          <label>Password</label>
          <input type="password" name="password" required />
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
