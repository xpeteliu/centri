import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignInPage from './features/Login/Login';
import SignUpPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';
import AddPost from './features/Post/AddPost';

export default function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={SignInPage} />
        <Route path="/register" component={SignUpPage} />
        <Route path="/addPost" component={AddPost}/>
      </Switch>
    </div>
  );
}
