import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './features/Login/Login';
import RegistrationPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';

export default function App() {
  return (
    <div>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegistrationPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </div>
  );
}
