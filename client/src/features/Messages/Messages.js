/* eslint react/prop-types: 0 */

import React, { useState } from 'react';
import {
  Container, Col, Stack, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Messages() {
  const [sender, setSender] = useState('');

  const handleSelectSender = async (senderId) => {
    // await fetch messages from/to sender
    console.log(sender);
    setSender(senderId);
  };

  return (
    <Container className="App">
      <Col xs={4}>
        <Stack direction="vertical" gap={5}>
          <SenderTab
            senderId={3}
            onSelect={handleSelectSender}
          />
        </Stack>
      </Col>
    </Container>
  );
}

function SenderTab({ senderId, onSelect }) {
  function handleClick(event) {
    onSelect(event.target.name);
  }
  const buttonName = `btnSelectUser${senderId}`;
  return (
    <Container className="App">
      <Card>
        <Card.Body>
          <Card.Text>
            Click me
          </Card.Text>
          <button name={buttonName} type="button" onClick={handleClick}>user</button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Messages;
