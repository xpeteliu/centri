import React from 'react';
import { Route } from 'react-router-dom';
import SignInPage from './features/Login/Login';
import SignUpPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';

export default function App() {
  return (
    <div>
      <Route exact path="/login"><SignInPage></SignInPage></Route>
      <Route exact path="/register"><SignUpPage></SignUpPage></Route>
      <Route exact path="/"><HomePage></HomePage></Route>
    </div>
  );
}
