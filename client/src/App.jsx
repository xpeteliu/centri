import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignInPage from './features/Login/Login';
import SignUpPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';
import { GroupPage, GroupListPage } from './features/Groups/Groups';
import AdminPage from './features/Groups/AdminPage';
import { MessageModal } from './features/common/MessageModal/MessageModal';
import ResetPassword from './features/ResetPassword/ResetPassword';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={SignInPage} />
        <Route path="/register" component={SignUpPage} />
        <Route exact path="/group/:groupId" component={GroupPage} />
        <Route path="/group/:groupId/admin" component={AdminPage} />
        <Route path="/groups" component={GroupListPage} />
        <Route path="/resetPassword" component={ResetPassword} />
      </Switch>
      <MessageModal />
    </div>
  );
}
