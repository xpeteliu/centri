/* eslint import/no-extraneous-dependencies: 0 */

import axios from 'axios';

const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';

export async function getUser(id) {
  try {
    const url = baseUrl.concat(`/user/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    return {};
  }
}

export async function getMessagesSender(senderId) {
  try {
    const url = baseUrl.concat('/message/filter/paginate');
    const data = {
      filter: {
        senderId,
      },
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    console.log('send err', err);
    return {};
  }
}

export async function getMessagesRecipient(recipientId) {
  try {
    const url = baseUrl.concat('/message/filter/paginate');
    const data = {
      filter: {
        recipientId,
      },
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    console.log('rec err', err);
    return {};
  }
}

export async function postMessage(message) {
  try {
    const url = baseUrl.concat('/message', message);
    const response = await axios.post(url);
    return response.data;
  } catch (err) {
    return {};
  }
}
