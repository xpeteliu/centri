import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from './features/Login/Login';
import RegistrationPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';

export default function App() {
  return (
    <div>
      <Route exact path="/login" />
      <LoginPage />
      <Route exact path="/register" />
      <RegistrationPage />
      <Route exact path="/" />
      <HomePage />
    </div>
  );
}
