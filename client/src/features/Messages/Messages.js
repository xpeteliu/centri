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
            handleSelectSender
          />
        </Stack>
      </Col>
    </Container>
  );
}

function SenderTab({ senderData, handleSelectSender }) {
  function handleClick(event) {
    handleSelectSender(event.target.name);
  }
  const buttonName = `btnSelectUser${senderData.id}`;
  return (
    <Container className="App">
      <button name={buttonName} onClick={handleClick}>user</button>
    </Container>
  );
}

export default Messages;
