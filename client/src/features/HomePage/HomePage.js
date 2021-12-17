import React, { useEffect, useState } from 'react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUser } from './fetch';
import { setUserId } from '../common/userSlice';
import { showModal } from '../common/MessageModal/modalSlice';

export default function HomePage() {
  const localUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(async () => {
    if (localUser.id) {
      setUser(await (await getUser(localUser.id)).json());
    }
  }, []);

  const handleDeactivation = async () => {
    const resp = await deleteUser(localUser.id);
    if (resp.status === 200 || resp.status === 204) {
      dispatch(setUserId(null));
      setUser(null);
      dispatch(showModal({
        headerText: 'User Deactivation',
        bodyText: 'Successfully deactivated the account.',
      }));
    } else {
      dispatch(showModal({
        headerText: 'Unable to Deactivate',
        bodyText: 'Fail to delete the account due to network issues.',
      }));
    }
  };

  return user == null ? (
    <Container className="h-100">
      <Row className="h-100">
        <Col className="my-auto">
          <div className="text-center">
            <h1>Welcome to Our App</h1>
            <Link to="/login">
              <Button variant="primary">Sign In</Button>
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/register">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  ) : (
    <Container className="h-100">
      <Row className="h-100">
        <Col className="my-auto">
          <img
            src={user.avatarId ? `/api/file/${user.avatarId}` : `${process.env.PUBLIC_URL}/logo192.png`}
            alt="User Avatar"
            style={{
              borderRadius: '50%',
              height: '10rem',
              width: '10rem',
            }}
          />
          <div className="text-center">
            <h1>{`Welcome back, ${user.username}`}</h1>
          </div>
          <div className="text-center">
            <h2>{`You joined at ${user.createdAt}`}</h2>
          </div>
          <Link to="/resetPassword">
            <Button variant="primary">Reset Password</Button>
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Button variant="danger" onClick={handleDeactivation}>Deactivate Account</Button>
        </Col>
      </Row>
    </Container>
  );
}
