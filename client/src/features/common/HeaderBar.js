import React from 'react';
import {
  Navbar, Nav, Image, Stack, Container,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

function HeaderBar() {
  const userId = useSelector((state) => state.user.id);
  return (
    <Navbar bg="light" expand="md" className="headerBar">
      <Container>
        <Navbar.Brand href="/">Logo</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/groups">Groups</Nav.Link>
            <Nav.Link href="/messages">Messages</Nav.Link>
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
