/* eslint import/no-extraneous-dependencies: 0 */

import axios from 'axios';

const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';

export async function getUser(id) {
  try {
    const url = baseUrl.concat(`/user/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    return {};
  }
}

export async function getMessagesSender(senderId) {
  try {
    const url = baseUrl.concat('/message/filter/paginate');
    const response = await axios({
      method: 'get',
      url,
      data: {
        filter: {
          senderId,
        },
      },
    });
    return response.data;
  } catch (err) {
    return {};
  }
}

export async function getMessagesRecipient(recipientId) {
  try {
    const url = baseUrl.concat('/message/filter/paginate');
    const response = await axios({
      method: 'get',
      url,
      data: {
        filter: {
          recipientId,
        },
      },
    });
    return response.data;
  } catch (err) {
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
