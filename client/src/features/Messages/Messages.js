/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import {
  Container, Row, Col, Stack, Card, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conversation from './Conversation';
import { HeaderBar } from '../common/HeaderBar';
import {
  getUser, getMessagesSender, getMessagesRecipient, postMessage,
} from './Requests';

function MessagePage() {
  const [otherUserId, setOtherUserId] = useState(-1);

  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  // const [localMessages, setLocalMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  // const [messages, setMessages] = useState([]);

  const fetchUser = async (userId) => {
    const user = await getUser(userId);
    return user;
  };

  const userNameDict = {};

  const fetchMessages = async (userId) => {
    const messagesSent = await getMessagesSender(userId);
    const messagesRecieved = await getMessagesRecipient(userId);
    const messagesAll = messagesSent.concat(messagesRecieved);

    messagesAll.sort((a, b) => (((new Date(a.createdAt)) > (new Date(b.createdAt))) ? 1 : -1));

    // console.log('messages', messagesAll);

    const tempIds = [];
    messagesAll.forEach(async (message) => {
      const { senderId } = message;
      console.log('id', senderId);
      if (!tempIds.some((id) => id === senderId) && senderId !== userId) {
        tempIds.push(senderId);
      }
    });

    const tempUsers = await Promise.all(tempIds.map((id) => fetchUser(id)));
    setUsers(tempUsers);

    return messagesAll;
  };

  const fetchConvo = async (userId) => {
    const messagesSent = await getMessagesSender(userId);
    const messagesRecieved = await getMessagesRecipient(userId);
    const messagesAll = messagesSent.concat(messagesRecieved);

    let tempConversation = [];
    // console.log('messages', messagesAll);
    tempConversation = messagesAll.filter(((message) => message.recipientId === otherUserId));
    // console.log('local', localMessages);
    // const filtered = localMessages.filter(((message) => message.recipientId === otherUserId));
    // tempConversation = tempConversation.concat(filtered);

    tempConversation.sort((a, b) => (((new Date(a.createdAt)) > (new Date(b.createdAt))) ? 1 : -1));

    setConversation(tempConversation);
  };

  const userId = '61a65336c4a2d7594d3f58f6'; // useSelector((state) => state.user._id);
  if (messages.length === 0) {
    setMessages(fetchMessages(userId));
  }

  const handleSelectSender = async (id) => {
    setOtherUserId(id);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const messageText = event.target.formMessageText.value;
    console.log('event', messageText);
    if (messageText.length > 0) {
      const newMessage = {
        senderId: userId,
        recipientId: otherUserId,
        content: messageText,
        createdAt: (new Date()).toString(),
      };
      console.log('POSTING MESSAGE', newMessage);
      await postMessage(newMessage);
      fetchConvo(userId);
      // setLocalMessages([...localMessages, newMessage]);
    }
  };

  useEffect(() => {
    console.log('switched to user', otherUserId);
    fetchConvo(userId);
  }, [otherUserId]);

  // useEffect(() => {
  //   console.log('local messages updated', localMessages);
  //   fetchConvo(userId);
  // }, [localMessages]);

  useEffect(() => {
    console.log('otherUser', otherUserId);
  }, [messages]);

  useEffect(() => {
    console.log('conversation updated', conversation);
  }, [conversation]);

  useEffect(() => {
    console.log('users updated', users);
  }, [users]);

  let content;

  if (otherUserId !== -1) {
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
