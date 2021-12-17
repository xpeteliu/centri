/* eslint react/prop-types: 0 */
/* eslint jsx-a11y/media-has-caption: 0 */

import React from 'react';
import {
  Container, Card, Row, Col, Form, Button, Stack,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Conversation(props) {
  const {
    messages, id, otherId, otherName, onSubmitMessage,
    onFileUpload, onAcceptInvite, onDeclineInvite,
  } = props;

  messages.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));

  const rows = [];
  messages.forEach((message) => {
    rows.push(<ConversationRow
      key={message._id}
      message={message}
      userId={id}
      onAcceptInvite={onAcceptInvite}
      onDeclineInvite={onDeclineInvite}
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
                  <Form.Control as="textarea" name="formMessageText" placeholder="..." />
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
  const {
    message, userId, onAcceptInvite, onDeclineInvite,
  } = props;
  const { senderId } = message;
  const alignLeft = senderId === userId;

  let content;

  if ('invitingGroupId' in message) {
    content = (
      <MessageInvite
        message={message}
        onAcceptInvite={onAcceptInvite}
        onDeclineInvite={onDeclineInvite}
      />
    );
  }

  if (message.attachmentType === 'none') {
    content = (
      <Message
        message={message}
      />
    );
  } else {
    content = (
      <MessageMedia
        message={message}
      />
    );
  }

  if (alignLeft) {
    return (
      <Row>
        <Col xs={6}>
          {content}
        </Col>
        <Col />
      </Row>
    );
  }
  return (
    <Row>
      <Col />
      <Col xs={6}>
        {content}
      </Col>
    </Row>
  );
}

function getDateString(parsedDate) {
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

  return date.concat(` ${hours}:${minutes}:${seconds}`);
}

function Message(props) {
  const { message } = props;
  const { content, createdAt } = message;
  const parsedDate = new Date(createdAt);

  const dateString = getDateString(parsedDate);

  return (
    <Card>
      <Card.Body className="p-4">
        <div align="left" style={{ whiteSpace: 'pre-wrap' }}>
          <Card.Text className="mb-2 h6">
            {content}
          </Card.Text>
        </div>
        <br />
        <Card.Text className="mb-2 text-muted">
          {dateString}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function MessageMedia(props) {
  const { message } = props;
  const {
    content, createdAt, attachmentId, attachmentType,
  } = message;
  const parsedDate = new Date(createdAt);

  const dateString = getDateString(parsedDate);
  const attachmentUrl = process.env.REACT_APP_API_URL || `/api/file/${attachmentId}`;

  let media;

  if (attachmentType.startsWith('image')) {
    media = (
      <img src={attachmentUrl} alt="attached img" width="360px" />
    );
  } else if (attachmentType.startsWith('audio')) {
    media = (
      <audio controls src={attachmentUrl} alt="attached audio" type="{attachmentType}" width="360px" />
    );
  } else if (attachmentType.startsWith('video')) {
    media = (
      <video controls src={attachmentUrl} alt="attached audio" type="{attachmentType}" width="360px" />
    );
  }

  return (
    <Card>
      <Card.Body className="p-4">
        {media}
        <div align="left" style={{ whiteSpace: 'pre-wrap' }}>
          <Card.Text className="mb-2 h6 p-2">
            {content}
          </Card.Text>
        </div>
        <Card.Text className="mb-2 text-muted">
          {dateString}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function MessageInvite(props) {
  const { message, onAcceptInvite, onDeclineInvite } = props;
  const { _id, content, createdAt } = message;
  const parsedDate = new Date(createdAt);

  const dateString = getDateString(parsedDate);

  return (
    <Card>
      <Card.Body className="p-4">
        <div align="left" style={{ whiteSpace: 'pre-wrap' }}>
          <Card.Text className="mb-2 h6">
            {content}
          </Card.Text>
        </div>
        <button type="submit" value={_id} onClick={onAcceptInvite}>
          Accept
        </button>
        <button type="submit" value={_id} onClick={onDeclineInvite}>
          Decline
        </button>
        <br />
        <Card.Text className="mb-2 text-muted">
          {dateString}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Conversation;
