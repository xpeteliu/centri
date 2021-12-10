import axios from 'axios';

const url = 'https://cis557-group20-project.herokuapp.com/api';

export const getGroups = async () => {
  try {
    const groupRequest = {
      filter: {
        $or:
          [{
            adminIds: '61a8e7c806aea993b4bb7545',
          },
          {
            memberIds: '61a8e7c806aea993b4bb7545',
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

// export default getGroups;
// export { getGroups, createGroup };
