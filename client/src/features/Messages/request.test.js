import { enableFetchMocks } from 'jest-fetch-mock';
import { 
  getUser, getGroups, getMessagesSender, getMessagesRecipient,
  postMessage, postFile, acceptInvite, declineInvite } from './Requests';

enableFetchMocks();
const fetch = require('jest-fetch-mock');

describe('Message request api tests', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

  const userId = '0123456789abcd';
  const senderId = '01234567890efgh';
  const message = {
    _id: '1234a',
    content: 'message 1 text',
    senderId: senderId,
    recipientId: userId,
    attachmentType: 'none',
  };
  const messageId = '1234a';

  it('Successfully get user', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get user'}));
    getUser(userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get user');
    });
  });

  it('Successfully get groups', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get groups'}));
    getGroups().then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get groups');
    });
  });

  it('Successfully get sender', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get sender'}));
    getMessagesSender(senderId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get sender');
    });
  });

  it('Successfully get recipient', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get recipient'}));
    getMessagesRecipient(userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get recipient');
    });
  });

  it('Successfully post message', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully post message'}));
    postMessage(message).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully post message');
    });
  });

  it('Successfully accept invitation', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully accept invitation'}));
    acceptInvite(messageId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully accept invitation');
    });
  });

  it('Successfully declined invitation', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully declined invitation'}));
    declineInvite(messageId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully declined invitation');
    });
  });
});
