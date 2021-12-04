/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Stack, Card, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conversation from './Conversation';

function MessagePage() {
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
      creatorId: 0, readerId: 2, content: '0 to 2, B', createdDate: new Date(1995, 11, 15),
    },
  ];

  const [otherUserId, setOtherUserId] = useState(-1);
  const [localMessages, setLocalMessages] = useState([]);

  const userNameDict = {};

  // TODO: Replace with store
  const userId = tempUserId;

  const handleSelectSender = async (id) => {
    // await GET request for messages from selected user
    console.log('id', id);
    setOtherUserId(id);
  };

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    const messageText = event.target.formMessageText.value;
    console.log('event', messageText);
    if (messageText.length > 0) {
      const newMessage = {
        creatorId: userId,
        readerId: otherUserId,
        content: messageText,
        createdDate: new Date(),
      };
      console.log('message', newMessage);
      // TODO: Replace with request, wait for POST response before adding
      // new message to localMessages, clear localMessages after receiving
      // messages from server
      // Send and await POST request here
      setLocalMessages([...localMessages, newMessage]);
    }
  };

  useEffect(() => {
    console.log('switched to user', otherUserId);
  }, [otherUserId]);

  useEffect(() => {
    console.log('local messages updated', localMessages);
  }, [localMessages]);

  // TODO: Replace with GET request
  const inbox = tempInbox;
  inbox.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));
  const userList = [];

  inbox.forEach((message) => {
    const senderId = message.creatorId;

    if (!userList.some((user) => user.id === senderId)) {
      // TODO: Replace with GET request
      const filtered = tempUsers.filter((user) => user.id === senderId);
      const senderName = filtered[0].name;

      userList.push({ id: senderId, name: senderName });
      userNameDict[senderId] = senderName;
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

    const filtered = localMessages.filter(((message) => message.readerId === otherUserId));
    conversation = conversation.concat(filtered);

    conversation.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));

    content = Conversation({
      messages: conversation,
      id: userId,
      otherId: otherUserId,
      otherName: userNameDict[otherUserId],
      onSubmitMessage: handleSubmitMessage,
    });
  }

  return (
    <Container classname="w-75">
      <div className="bg-light">
        <Row className="h-99 p-1">
          <Col className="p-3" xs={3}>
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
      </div>
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
  const listStyle = {
    'max-height': '90vh',
    'overflow-y': 'scroll',
    'overflow-x': 'clip',
  };
  return (
    <div style={listStyle}>
      <ListGroup className="w-100">
        {rows}
      </ListGroup>
    </div>
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
              <br />
              <br />
              <br />
            </Card.Text>
          </Card.Body>
        </Card>
      </ListGroupItem>
    </Container>
  );
}

export default MessagePage;
