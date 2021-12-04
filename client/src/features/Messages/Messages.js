/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import {
  Container, Row, Col, Stack, Card, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conversation from './Conversation';
import { HeaderBar } from '../common/HeaderBar';
import { getUser, getMessagesSender, getMessagesRecipient } from './Requests';

function MessagePage() {
  const [otherUserId, setOtherUserId] = useState(-1);
  const [localMessages, setLocalMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchUser = async (userId) => {
    const user = await getUser(userId);
    return user;
  };

  const fetchMessages = async (userId) => {
    const messagesSent = await getMessagesSender(userId);
    const messagesRecieved = await getMessagesRecipient(userId);
    const messagesAll = messagesSent.concat(messagesRecieved);
    return messagesAll;
  };

  const userNameDict = {};

  const userId = 0; // useSelector((state) => state.user.id);

  const handleSelectSender = async (id) => {
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
    setMessages(fetchMessages(userId));
  });

  useEffect(() => {
    console.log('switched to user', otherUserId);
  }, [otherUserId]);

  useEffect(() => {
    console.log('local messages updated', localMessages);
  }, [localMessages]);

  useEffect(async () => {
    messages.sort((a, b) => ((a.createdDate > b.createdDate) ? 1 : -1));
    messages.forEach(async (message) => {
      const { senderId } = message;
      if (!users.some((user) => user._id === senderId) && senderId !== userId) {
        const otherUser = await fetchUser(senderId);
        userNameDict[senderId] = otherUser.username;
        setUsers([...users, otherUser]);
      }
    });
  }, [messages]);

  useEffect(() => {
    console.log('users updated', users);
  }, [users]);

  let content;
  if (otherUserId !== -1) {
    // TODO: Replace with GET request
    let conversation = [];

    conversation = localMessages.filter(((message) => message.recipientId === otherUserId));

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
    <Container classname="App">
      <HeaderBar />
      <Container classname="w-75">
        <div className="bg-light">
          <Row className="h-99 p-1">
            <Col className="p-3" xs={3}>
              <Stack direction="vertical" gap={1}>
                <UserList
                  users={users}
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
          userId={user._id}
          userName={user.username}
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
