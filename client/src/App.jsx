import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignInPage from './features/Login/Login';
import SignUpPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={SignInPage} />
        <Route path="/register" component={SignUpPage} />
      </Switch>
    </div>
  );
}
