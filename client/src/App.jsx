import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignInPage from './features/Login/Login';
import SignUpPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';
import { GroupPage, GroupListPage } from './features/Groups/Groups';
import { MessageModal } from './features/common/MessageModal/MessageModal';
import CreatePost from './features/Posting/CreatePost';
import AddComment from './features/Posting/AddComments';
// import DeletePost from './features/Posting/DeletePost';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={SignInPage} />
        <Route path="/register" component={SignUpPage} />
        <Route exact path="/group" component={GroupPage} />
        <Route path="/groups" component={GroupListPage} />
        <Route path="/group/:groupId/posting" component={CreatePost} />
        <Route path="/comment" component={AddComment} />
      </Switch>
      <MessageModal />
    </div>
  );
}
