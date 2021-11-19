/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Stack, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Conversation({ messages }) {
  console.log(messages);
  return (
    <h1>
      hi
    </h1>
  );
}

function Messages() {
  // const tempUser = { id: 1, name: 'user1' };
  const tempUsers = [
    { id: 1, name: 'user1' },
    { id: 2, name: 'user2' },
    { id: 3, name: 'user3' },
  ];
  const [userId, setUserId] = useState(-1);

  const handleSelectSender = async (id) => {
    // await fetch messages from/to sender
    console.log('id', id);
    setUserId(id);
  };

  useEffect(() => {
    console.log('effect', userId);
  }, [userId]);

  const filteredMessages = [
    { id: 1 },
  ];

  let content;
  if (userId !== -1) {
    content = Conversation(filteredMessages);
  }

  return (
    <Container className="App">
      <Row>
        <Col xs={2}>
          <Stack direction="vertical" gap={1}>
            <UserList
              users={tempUsers}
              onSelect={handleSelectSender}
            />
          </Stack>
        </Col>
        <Col xs={10}>
          {content}
        </Col>
      </Row>
    </Container>
  );
}

function UserList({ users, onSelect }) {
  const rows = [];
  users.forEach((user) => {
    rows.push(
      <UserTab
        userId={user.id}
        userName={user.name}
        onSelect={onSelect}
      />,
    );
  });
  return (
    <Stack direction="vertical" gap={5}>
      {rows}
    </Stack>
  );
}

function UserTab({ userId, userName, onSelect }) {
  const handleClick = () => {
    onSelect(userId);
  };
  return (
    <Container className="App">
      <Card onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Card.Body>
          <Card.Text>
            {userName}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Messages;
