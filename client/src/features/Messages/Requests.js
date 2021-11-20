import axios from 'axios';

const baseUrl = 'https://team20-backend.com';

export async function getUser(id) {
  try {
    const url = baseUrl.concat(`/user/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    return {};
  }
}

export async function getInbox(id) {
  try {
    const url = baseUrl.concat(`/privateMessage/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    return {};
  }
}

export async function getConversation(userId, otherUserId) {
  try {
    const urlA = baseUrl.concat(`/privateMessage/${userId}/${otherUserId}`);
    const responseA = await axios.get(urlA);
    const messagesA = responseA.data;

    const urlB = baseUrl.concat(`/privateMessage/${otherUserId}/${userId}`);
    const responseB = await axios.get(urlB);
    const messagesB = responseB.data;

    return messagesA.concat(messagesB);
  } catch (err) {
    return {};
  }
}