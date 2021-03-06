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

export const getPublicGroups = async (sortMethod) => {
  try {
    const groupRequest = {
      filter: {
        status: 'public',
      },
      sortMethod,
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
        status: 'public',
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

export const getPostsByGroupId = async (groupId, userId) => {
  try {
    const postsRequest = {
      filter: {
        groupId,
        hiderIds: {
          $ne: userId,
        },
      },
      sort: {
        age: 'ascending',
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

export const inviteUserMessage = async (groupId, senderId, recipientId) => {
  try {
    const messageRequest = {
      content: 'You have been invited to join a group!',
      senderId,
      recipientId,
      invitingGroupId: groupId,
    };
    const result = await axios.post(`${url}/message`, messageRequest);
    return result.data;
  } catch (err) {
    return {};
  }
};

export const acceptUser = async (groupId, userId, accept) => {
  try {
    if (accept) {
      const inviteRequest = {
        role: 'member',
      };
      const result = await axios.put(`${url}/group/${groupId}/member/${userId}`, inviteRequest, { withCredentials: true });
      return result.status;
    }
    const result = await axios.delete(`${url}/group/${groupId}/member/${userId}`);
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

export const deletePost = async (postId) => {
  try {
    const result = await axios.delete(`${url}/posting/${postId}`);
    return result.status;
  } catch (err) {
    return 400;
  }
};

export const promoteAdmin = async (groupId, userId, promote) => {
  try {
    const roleRequest = {
      role: promote ? 'admin' : 'member',
    };
    const result = await axios.put(`${url}/group/${groupId}/member/${userId}`, roleRequest);
    return result.status;
  } catch (err) {
    return 400;
  }
};

export const hidePost = async (postId) => {
  try {
    // const newPostRequest = {
    //   hiderIds: [userId],
    // };
    const result = await axios.put(`${url}/posting/${postId}/hide`);
    return result.status;
  } catch (err) {
    return 400;
  }
};

export const flagPost = async (postId, userId) => {
  try {
    const flagRequest = {
      flaggerId: userId,
    };
    const result = await axios.put(`${url}/posting/${postId}`, flagRequest);
    return result.data;
  } catch (err) {
    return 400;
  }
};

export const getFlaggedPosts = async (groupId) => {
  try {
    const flaggedPostsRequest = {
      filter: {
        groupId,
        flaggerId: {
          $ne: null,
        },
      },
    };
    const result = await axios.post(`${url}/posting/filter/paginate`, flaggedPostsRequest);
    return result.data;
  } catch (err) {
    return err;
  }
};

export const filterPostsByHashTag = async (hashTag, groupId) => {
  try {
    const postFilter = {
      filter: {
        groupId,
        content: {
          $regex: `\\B#${hashTag}\\b`,
        },
      },
    };
    const posts = await axios.post(`${url}/posting/filter/paginate`, postFilter);
    return posts.data;
  } catch (err) {
    return [];
  }
};
