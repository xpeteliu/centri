import axios from 'axios';

// const url = 'https://cis557-group20-project.herokuapp.com/api';
const url = '/api';

export const getMyGroups = async (userId) => {
  try {
    const groupRequest = {
      filter: {
        $or:
          [{
            adminIds: userId,
          },
          {
            memberIds: userId,
          }],
      },
      sortMethod: 'latestUpdates',
    };
    const groups = await axios.post(`${url}/group/filter/sort`, groupRequest);
    return groups.data;
  } catch (err) {
    return [];
  }
};

export const getPublicGroups = async () => {
  try {
    const groupRequest = {
      filter: {
        status: 'public',
      },
      sortMethod: 'latestUpdates',
    };
    const groups = await axios.post(`${url}/group/filter/sort`, groupRequest);
    return groups.data;
  } catch (err) {
    return [];
  }
};

export const filterGroupsByTag = async (tag) => {
  try {
    const groupRequest = {
      filter: {
        tags: tag,
      },
      sortMethod: 'latestUpdates',
    };
    const groups = await axios.post(`${url}/group/filter/sort`, groupRequest);
    return groups.data;
  } catch (err) {
    return [];
  }
};

export const createGroup = async (creatorId, title, status) => {
  try {
    const createGroupRequest = { creatorId, title, status };
    const group = await axios.post(`${url}/group`, createGroupRequest);
    return group.data;
  } catch (err) {
    return {};
  }
};

export const getGroupById = async (groupId) => {
  try {
    const group = await axios.get(`${url}/group/${groupId}`);
    return group.data;
  } catch (err) {
    return {};
  }
};

export const getPostsByGroupId = async (groupId) => {
  try {
    const postsRequest = {
      filter: {
        groupId,
      },
    };
    const posts = await axios.post(`${url}/posting/filter/paginate`, postsRequest);
    return posts.data;
  } catch (err) {
    return [];
  }
};

export const getPostById = async (postId) => {
  try {
    const post = await axios.get(`${url}/posting/${postId}`);
    return post.data;
  } catch (err) {
    return {};
  }
};

export const inviteUser = async (groupId, userId) => {
  try {
    const inviteRequest = {
      role: 'pendingMember',
      // userId,
    };
    const result = await axios.put(`${url}/group/${groupId}/member/${userId}`, inviteRequest);
    return result.status;
  } catch (err) {
    return 400;
  }
};

export const acceptUser = async (groupId, userId) => {
  try {
    const inviteRequest = {
      role: 'member',
      // userId,
    };
    const result = await axios.put(`${url}/group/${groupId}/member/${userId}`, inviteRequest, { withCredentials: true });
    return result.status;
  } catch (err) {
    return 400;
  }
};

export const addTag = async (groupId, tag) => {
  try {
    const result = await axios.put(`${url}/group/${groupId}/tag/${tag}`);
    return result.status;
  } catch (err) {
    return 400;
  }
};

export const getUsersByName = async (username) => {
  try {
    const nameRequest = {
      filter: {
        username,
      },
    };
    const result = await axios.post(`${url}/user/filter/paginate`, nameRequest);
    return result.data;
  } catch (err) {
    return [];
  }
};

export const getUserById = async (userId) => {
  try {
    const result = await axios.get(`${url}/user/${userId}`);
    return result.data;
  } catch (err) {
    return {};
  }
};

export const leaveGroup = async (groupId, userId) => {
  try {
    const result = await axios.delete(`${url}/group/${groupId}/member/${userId}`);
    return result.status;
  } catch (err) {
    return 400;
  }
};
