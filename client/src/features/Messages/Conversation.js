/* eslint react/prop-types: 0 */

import React from 'react';
import {
  Container, Card, Row, Col, Form, Button, Stack,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Conversation(props) {
  const {
    messages, id, otherId, otherName, onSubmitMessage, onFileUpload,
  } = props;

  messages.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));

  const rows = [];
  messages.forEach((message) => {
    rows.push(<ConversationRow
      key={message._id}
      message={message}
      userId={id}
    />);
  });

  const convoStyle = {
    maxHeight: '90vh',
  };

  const listStyle = {
    maxHeight: '65vh',
    overflowY: 'scroll',
    overflowX: 'clip',
  };

  console.log('name', otherName);

  return (
    <div style={convoStyle}>
      <h4 align="left">
        {otherName}
      </h4>
      <Container className="p-3 d-flex flex-column justify-content-between">
        <div style={listStyle}>
          <Row>
            {rows}
          </Row>
        </div>
        <Row>
          <Input
            onSubmitMessage={onSubmitMessage}
            onFileUpload={onFileUpload}
            userId={id}
            otherUserId={otherId}
          />
        </Row>
      </Container>
    </div>
  );
}

function Input(props) {
  const { onSubmitMessage, onFileUpload } = props;
  return (
    <Container className="p-3">
      <Stack direction="horizontal">
        <Col xs={8}>
          <Form onSubmit={onSubmitMessage} controlid="formMessage">
            <Form.Group>
              <Row>
                <Col xs={1}>
                  <Form.Label>Chat</Form.Label>
                </Col>
                <Col xs={9}>
                  <Form.Control name="formMessageText" placeholder="..." />
                </Col>
                <Col xs={1}>
                  <Button variant="primary" type="submit">
                    Send
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
        <Col xs={4}>
          <form encType="multipart/form-data">
            <input type="file" name="file" onChange={onFileUpload} />
          </form>
        </Col>
      </Stack>
    </Container>
  );
}

function ConversationRow(props) {
  const { message, userId } = props;
  const { senderId } = message;
  const alignLeft = senderId === userId;

  if (alignLeft) {
    return (
      <Row>
        <Col xs={6}>
          <Message
            message={message}
          />
        </Col>
        <Col />
      </Row>
    );
  }
  return (
    <Row>
      <Col />
      <Col xs={6}>
        <Message
          message={message}
        />
      </Col>
    </Row>
  );
}

function Message(props) {
  const { message } = props;
  const { content, createdAt } = message;
  const parsedDate = new Date(createdAt);
  const date = parsedDate.toLocaleDateString('en-US');

  const padTime = (timeString) => {
    if (timeString.length < 2) {
      return '0'.concat(timeString);
    }
    return timeString;
  };
  const hours = padTime(parsedDate.getHours().toString());
  const minutes = padTime(parsedDate.getMinutes().toString());
  const seconds = padTime(parsedDate.getSeconds().toString());

  const dateString = date.concat(` ${hours}:${minutes}:${seconds}`);

  return (
    <Card>
      <Card.Body className="p-4">
        <Card.Text className="mb-2 h6">
          {content}
        </Card.Text>
        <br />
        <Card.Text className="mb-2 text-muted">
          {dateString}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Conversation;
