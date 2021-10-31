import React from 'react';
import {
  Button, Container, Row, Col, Navbar, Nav, Image, Stack,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { GroupListItem } from './Groups';

function App() {
  return (
    <Container className="App">
      <HeaderBar />
      <Stack direction="vertical" gap={5} className="mainContent">
        <Row className="groupButtons">
          <Col xs="4">
            <Button variant="secondary">Private Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="secondary">Public Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="primary">Create Group</Button>
          </Col>
        </Row>
        <Row className="groupList">
          <Stack direction="vertical" gap={5}>
            <GroupListItem name="Group Name" />
            <GroupListItem name="Group Name 2" />
            <GroupListItem name="Group Name 3" />
          </Stack>
        </Row>
      </Stack>
    </Container>
  );
}

function HeaderBar() {
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
            <Navbar.Text>Justin Dong</Navbar.Text>
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default App;
