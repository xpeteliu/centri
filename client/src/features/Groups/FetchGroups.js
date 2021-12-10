import axios from 'axios';

const url = 'https://cis557-group20-project.herokuapp.com/api';

export const getGroups = async (userId) => {
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
      // adminIds: '61a8e7c806aea993b4bb7545',
      sortMethod: 'latestUpdates',
    };
    const groups = await axios.post(`${url}/group/filter/sort`, groupRequest);
    return groups.data;
  } catch (err) {
    // console.log("couldn't get groups");
    return null;
  }
};

export const createGroup = async (creatorId, title) => {
  try {
    const createGroupRequest = { creatorId, title };
    const group = await axios.post(`${url}/group`, createGroupRequest);
    return group.data;
  } catch (err) {
    return null;
  }
};

export const getGroupById = async (groupId) => {
  try {
    const group = await axios.get(`${url}/group/${groupId}`);
    return group.data;
  } catch (err) {
    return null;
  }
};

// export default getGroups;
// export { getGroups, createGroup };
