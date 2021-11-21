/* eslint react/prop-types: 0 */

import React from 'react';
import {
  Container, Card, Row, Col,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Conversation(props) {
  const { messages, id } = props;

  const rows = [];
  messages.forEach((message) => {
    rows.push(<ConversationRow
      message={message}
      userId={id}
    />);
  });

  return (
    <Container className="App">
      {rows}
    </Container>
  );
}

function ConversationRow(props) {
  console.log(props);
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
