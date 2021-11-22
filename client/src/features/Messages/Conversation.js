/* eslint react/prop-types: 0 */

import React from 'react';
import {
  Container, Card, Row, Col, Form, Button,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Conversation(props) {
  const {
    messages, id, otherId, onSubmitMessage,
  } = props;

  messages.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));

  const rows = [];
  messages.forEach((message) => {
    rows.push(<ConversationRow
      message={message}
      userId={id}
    />);
  });

  return (
    <Container className="d-flex flex-column justify-content-between">
      <Row>
        {rows}
      </Row>
      <Row>
        <Input
          handleSubmit={onSubmitMessage}
          userId={id}
          otherUserId={otherId}
        />
      </Row>
    </Container>
  );
}

function Input(props) {
  const { handleSubmit } = props;
  return (
    <Container className="p-3">
      <Form onSubmit={handleSubmit} controlId="formMessage">
        <Form.Group>
          <Form.Label>Chat</Form.Label>
          <Form.Control name="formMessageText" placeholder="..." />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
}

function ConversationRow(props) {
  const { message, userId } = props;
  const { creatorId } = message;

  const alignLeft = creatorId !== userId;

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
  const { content, createdDate } = message;
  const dateString = createdDate.toString();

  return (
    <Card>
      <Card.Body>
        <Card.Text>
          {content}
          <br />
          {dateString}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Conversation;
