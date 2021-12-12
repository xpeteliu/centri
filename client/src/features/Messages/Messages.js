/* eslint react/prop-types: 0 */
/* eslint no-unused-vars: 1 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container, Row, Col, Stack, Card, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conversation from './Conversation';
import { HeaderBar } from '../common/HeaderBar';
import {
  getUser, getMessagesSender, getMessagesRecipient, postMessage, postFile,
} from './Requests';

function MessagePage() {
  const ACCEPTED_FILE_TYPES = ['image', 'audio', 'video'];

  const [otherUserId, setOtherUserId] = useState(-1);
  const [otherUsername, setOtherUsername] = useState('');

  const [users, setUsers] = useState([]);

  const [waiting, setWaiting] = useState(true);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);

  const [attachedFile, setAttachedFile] = useState(null);

  const fetchUser = async (userId) => {
    const user = await getUser(userId);
    return user;
  };

  const fetchMessages = async (userId) => {
    const messagesSent = await getMessagesSender(userId);
    const messagesRecieved = await getMessagesRecipient(userId);
    const messagesAll = messagesSent.concat(messagesRecieved);

    messagesAll.sort((a, b) => (((new Date(a.createdAt)) > (new Date(b.createdAt))) ? 1 : -1));

    const tempIds = [];
    messagesAll.forEach(async (message) => {
      const { senderId } = message;
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

    const id = otherUserId;

    let tempConversation = [];
    tempConversation = messagesAll.filter(((m) => m.recipientId === id || m.senderId === id));

    tempConversation.sort((a, b) => (((new Date(a.createdAt)) > (new Date(b.createdAt))) ? 1 : -1));

    setConversation(tempConversation);
  };

  const userId = '61a65bf45915a4279a04ac35';// useSelector((state) => state.user._id);

  if (waiting) {
    setMessages(fetchMessages(userId));
    setWaiting(false);
  }

  const handleSelectSender = async (user) => {
    setOtherUserId(user.userId);
    setOtherUsername(user.userName);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('files', event.target.files);
    if (ACCEPTED_FILE_TYPES.some((type) => file.type.startsWith(type))) {
      setAttachedFile(file);
    }
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const messageText = event.target.formMessageText.value;
    console.log('event', messageText);
    if (messageText.length > 0) {
      if (attachedFile === null) {
        const newMessage = {
          content: messageText,
          attachmentType: 'none',
          senderId: userId,
          recipientId: otherUserId,
        };
        console.log('POSTING MESSAGE', newMessage);
        await postMessage(newMessage);
        fetchConvo(userId);
      } else {
        console.log('UPLOADING FILE', attachedFile);
        const response = await postFile(attachedFile);
        console.log('UPLOADING FILE RESPONSE', response);
        const fileId = response.id;
        const newMessage = {
          content: messageText,
          attachmentId: fileId,
          attachmentType: attachedFile.type,
          senderId: userId,
          recipientId: otherUserId,
        };
        console.log('POSTING MESSAGE', newMessage);
        await postMessage(newMessage);
        fetchConvo(userId);
      }
    }
  };

  useEffect(() => {
    console.log('rendered');
    const pollMessages = setInterval(() => {
      fetchMessages(userId);
    }, 10000);

    return () => {
      clearInterval(pollMessages);
    };
  }, []);

  useEffect(() => {
    console.log('switched to user', otherUserId);
    fetchConvo(userId);
    const pollConvo = setInterval(() => {
      if (otherUserId !== -1) {
        fetchConvo(userId);
      }
    }, 5000);

    return () => {
      clearInterval(pollConvo);
    };
  }, [otherUserId]);

  useEffect(() => {
    console.log('attached file', attachedFile);
  }, [attachedFile]);

  useEffect(() => {
    console.log('messages updated', messages);
  }, [messages]);

  useEffect(() => {
    console.log('conversation updated', conversation, ', ', otherUserId);
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
      otherName: otherUsername,
      onSubmitMessage: handleSubmitMessage,
      onFileUpload: handleFileUpload,
    });
  }

  return (
    <Container className="App">
      <HeaderBar />
      <Container className="w-100">
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
            <Col className="w-100">
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
      <Row key={user._id}>
        <UserTab
          userId={user._id}
          userName={user.username}
          onSelect={onSelect}
        />
      </Row>,
    );
  });
  const listStyle = {
    maxHeight: '90vh',
    overflowY: 'scroll',
    overflowX: 'clip',
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
    onSelect({ userId, userName });
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
