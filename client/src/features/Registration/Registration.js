import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
  return (
    <div className="text-center m-5-auto">
      <h2>Join us</h2>
      <h5>Create your personal account</h5>
      <form action="/home">
        <p>
          <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
          <label>Username</label>
          <input type="text" name="first_name" required />
        </p>
        <p>
          <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
          <label>Email address</label>
          <input type="email" name="email" required />
        </p>
        <p>
          <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
          <label>Password</label>
          <input type="password" name="password" requiredc />
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
