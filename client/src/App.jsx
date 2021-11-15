import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Messages from './features/Messages/Messages';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/messaging">
          <Messages />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
