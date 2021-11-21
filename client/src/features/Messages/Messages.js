/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Stack, Card, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conversation from './Conversation';

function Messages() {
  const tempUserId = 0;
  const tempUsers = [
    { id: 1, name: 'user1' },
    { id: 2, name: 'user2' },
  ];
  const tempInbox = [
    {
      creatorId: 1, readerId: 0, content: '1 to 0, A', createdDate: new Date(1995, 11, 17),
    },
    {
      creatorId: 2, readerId: 0, content: '2 to 0, A', createdDate: new Date(1995, 11, 14),
    },
    {
      creatorId: 2, readerId: 0, content: '2 to 0, C', createdDate: new Date(1995, 11, 16),
    },
  ];

  const tempConversation1 = [
    {
      creatorId: 1, readerId: 0, content: '1 to 0, A', createdDate: new Date(1995, 11, 17),
    },
  ];

  const tempConversation2 = [
    {
      creatorId: 2, readerId: 0, content: '2 to 0, A', createdDate: new Date(1995, 11, 14),
    },
    {
      creatorId: 2, readerId: 0, content: '2 to 0, C', createdDate: new Date(1995, 11, 16),
    },
    {
      creatorId: 0, readerId: 2, content: '2 to 0, B', createdDate: new Date(1995, 11, 15),
    },
  ];

  const [otherUserId, setOtherUserId] = useState(-1);

  // TODO: Replace with store
  const userId = tempUserId;

  const handleSelectSender = async (id) => {
    // await fetch messages from/to sender
    console.log('id', id);
    setOtherUserId(id);
  };

  useEffect(() => {
    console.log('effect', otherUserId);
  }, [otherUserId]);

  // TODO: Replace with GET request
  const inbox = tempInbox;
  inbox.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));
  const userList = [];

  inbox.forEach((message) => {
    const senderId = message.creatorId;
    // TODO: Replace with GET request
    const filtered = tempUsers.filter((user) => user.id === senderId);
    const senderName = filtered[0].name;

    if (!userList.some((user) => user.name === senderName)) {
      userList.push({ id: senderId, name: senderName });
    }
  });

  let content;
  if (otherUserId !== -1) {
    // TODO: Replace with GET request
    let conversation = [];

    if (otherUserId === 1) {
      conversation = tempConversation1;
    } else if (otherUserId === 2) {
      conversation = tempConversation2;
    }

    conversation.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));

    content = Conversation({ messages: conversation, id: userId });
  }

  return (
    <Container classname="w-100">
      <Row className="h-100 m-3">
        <Col xs={3}>
          <Stack direction="vertical" gap={1}>
            <UserList
              users={userList}
              onSelect={handleSelectSender}
            />
          </Stack>
        </Col>
        <Col classname="w-75">
          {content}
        </Col>
      </Row>
    </Container>
  );
}

function UserList(props) {
  const { users, onSelect } = props;
  const rows = [];
  users.forEach((user) => {
    rows.push(
      <Row>
        <UserTab
          userId={user.id}
          userName={user.name}
          onSelect={onSelect}
        />
      </Row>,
    );
  });
  return (
    <ListGroup>
      {rows}
    </ListGroup>
  );
}

function UserTab(props) {
  const { userId, userName, onSelect } = props;
  const handleClick = () => {
    onSelect(userId);
  };
  return (
    <Container className="App">
      <ListGroupItem action onClick={handleClick}>
        <Card>
          <Card.Body>
            <Card.Text>
              {userName}
            </Card.Text>
          </Card.Body>
        </Card>
      </ListGroupItem>
    </Container>
  );
}

export default Messages;
