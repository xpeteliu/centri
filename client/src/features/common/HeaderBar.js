import React, { useEffect, useState } from 'react';
import {
  Navbar, Nav, Image, Stack, Container,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserById } from './HeaderBarFetch';

function HeaderBar() {
  const userId = useSelector((state) => state.user.id);
  const history = useHistory();
  const [user, setUser] = useState({});
  useEffect(async () => {
    if (!user.username) {
      if (userId) {
        const newUser = await getUserById(userId);
        setUser(newUser);
      }
    }
  });
  return (
    <Navbar bg="light" expand="md" className="headerBar">
      <Container>
        <Navbar.Brand role="presentation" onClick={() => history.push('/')} onKeyPress={() => null}>Team20</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {userId && <Nav.Link role="presentation" onClick={() => history.push('/groups')} onKeyPress={() => null}>Groups</Nav.Link>}
            {userId && <Nav.Link role="presentation" onClick={() => history.push('/messages')} onKeyPress={() => null}>Messages</Nav.Link>}
          </Nav>
          <Stack direction="horizontal" gap={2}>
            {userId && <Image src="./photo.jpg" width="30" height="30" roundedCircle />}
            <Navbar.Text>{user.username}</Navbar.Text>
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { HeaderBar };
