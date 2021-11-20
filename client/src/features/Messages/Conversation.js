/* eslint react/prop-types: 0 */

import React from 'react';
import {
  Container, Card, Row, Col,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ConversationRow(props) {
  console.log(props);
  const { message, userId } = props;
  const { creatorId, content, createdDate } = message;
  const dateString = createdDate.toString();
  const alignLeft = creatorId !== userId;
  console.log('c', creatorId);
  console.log('u', userId);
  if (alignLeft) {
    return (
      <Row>
        <Col xs={6}>
          <Card>
            <Card.Body>
              <Card.Text>
                {content}
                <br />
                {dateString}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col />
      </Row>
    );
  }
  return (
    <Row>
      <Col />
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Card.Text>
              {content}
              <br />
              {dateString}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

function Conversation(props) {
  const { messages, id } = props;
  console.log('u1', id);
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

export default Conversation;
