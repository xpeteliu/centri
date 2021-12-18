import axios from 'axios';

const url = '/api';

export const getUserById = async (userId) => {
  try {
    const result = await axios.get(`${url}/user/${userId}`);
    return result.data;
  } catch (err) {
    return {};
  }
};
