/* eslint import/no-extraneous-dependencies: 0 */

import axios from 'axios';
import FormData from 'form-data';

const baseUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_API_URL
  : '';

export async function getUser(id) {
  try {
    const url = baseUrl.concat(`/user/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    // console.log(err);
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    // console.log('send err', err);
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    // console.log('rec err', err);
    return {};
  }
}

export async function postMessage(message) {
  try {
    const url = baseUrl.concat('/message');
    const response = await axios.post(url, message);
    // console.log('post response', response);
    return response.data;
  } catch (err) {
    // console.log('post err', err);
    return {};
  }
}

export async function postFile(file) {
  try {
    const url = baseUrl.concat('/file');
    // console.log('REQ POSTS FILE', file);
    const formData = new FormData();
    formData.append('file', file);
    // console.log('FORM DATA', formData);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  } catch (err) {
    // console.log('upload post err', err);
    return {};
  }
}
