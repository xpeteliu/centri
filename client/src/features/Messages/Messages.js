/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import {
  Container, Col, Stack, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Messages() {
  // const tempUser = { id: 1, name: 'user1' };
  const tempUsers = [
    { id: 1, name: 'user1' },
    { id: 2, name: 'user2' },
    { id: 3, name: 'user3' },
  ];
  const [sender, setSender] = useState(0);

  const handleSelectSender = async (senderId) => {
    // await fetch messages from/to sender
    console.log('id', senderId);
    setSender(senderId);
  };

  useEffect(() => {
    console.log(sender);
  }, [sender]);

  return (
    <Container className="App">
      <Col xs={2}>
        <Stack direction="vertical" gap={5}>
          <UserList
            users={tempUsers}
            onSelect={handleSelectSender}
          />
        </Stack>
      </Col>
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
