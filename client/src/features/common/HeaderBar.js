import React from 'react';
import {
  Navbar, Nav, Image, Stack, Container,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HeaderBar() {
  const userId = useSelector((state) => state.user.id);
  const history = useHistory();
  return (
    <Navbar bg="light" expand="md" className="headerBar">
      <Container>
        <Navbar.Brand role="presentation" onClick={() => history.push('/')} onKeyPress={() => null}>Logo</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link role="presentation" onClick={() => history.push('/groups')} onKeyPress={() => null}>Groups</Nav.Link>
            <Nav.Link role="presentation" onClick={() => history.push('/messages')} onKeyPress={() => null}>Messages</Nav.Link>
          </Nav>
          <Stack direction="horizontal" gap={2}>
            <Image src="./photo.jpg" width="30" height="30" roundedCircle />
            <Navbar.Text>{userId}</Navbar.Text>
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { HeaderBar };
