/* eslint react/prop-types: 0 */

import React, { useState } from 'react';
import {
  Container, Col, Stack,
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
            onSelect={handleSelectSender}
          />
        </Stack>
      </Col>
    </Container>
  );
}

function SenderTab({ senderData, onSelect }) {
  function handleClick(event) {
    onSelect(event.target.name);
  }
  const buttonName = `btnSelectUser${senderData.id}`;
  return (
    <Container className="App">
      <button name={buttonName} type="button" onClick={handleClick}>user</button>
    </Container>
  );
}

export default Messages;
