import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignInPage from './features/Login/Login';
import SignUpPage from './features/Registration/Registration';
import HomePage from './features/HomePage/HomePage';
import { GroupPage, GroupListPage } from './features/Groups/Groups';
import AdminPage from './features/Groups/AdminPage';
import MessagePage from './features/Messages/Messages';
import { MessageModal } from './features/common/MessageModal/MessageModal';
import ResetPassword from './features/ResetPassword/ResetPassword';
import CreatePost from './features/Posting/CreatePost';
import AddComment from './features/Posting/AddComments';
import { HeaderBar } from './features/common/HeaderBar';
import PostDetail from './features/Posting/PostDetail';
import UpdateComment from './features/Posting/UpdateComment';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <HeaderBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={SignInPage} />
        <Route path="/register" component={SignUpPage} />
        <Route exact path="/group/:groupId" component={GroupPage} />
        <Route path="/group/:groupId/admin" component={AdminPage} />
        <Route path="/groups" component={GroupListPage} />
        <Route path="/messages" component={MessagePage} />
        <Route path="/resetPassword" component={ResetPassword} />
        <Route exact path="/group/:groupId/posting" component={CreatePost} />
        <Route path="/group/:groupId/posting/:postingId/comment" component={AddComment} />
        <Route path="/group/:groupId/posting/:postingId" component={PostDetail} />
        <Route path="/group/:groupId/posting/:postingId/comment/:commentId" component={UpdateComment}/>
      </Switch>
      <MessageModal />
    </div>
  );
}
