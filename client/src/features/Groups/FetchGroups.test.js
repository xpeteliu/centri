import { enableFetchMocks } from 'jest-fetch-mock';
import { 
  getMyGroups, getPublicGroups, filterGroupsByTag, createGroup, getGroupById,
  getPostsByGroupId, getPostById, inviteUser, inviteUserMessage, acceptUser, addTag,
  getUsersByName, getUserById, leaveGroup, deletePost, promoteAdmin, hidePost, flagPost,
  getFlaggedPosts, filterPostsByHashTag } from './FetchGroups';

enableFetchMocks();
const fetch = require('jest-fetch-mock');

describe('Fetch groups api tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const userId = '1234567890abcd';
  const tag = 'test';
  const title = 'test title';
  const status = 'public';
  const groupId = '1234567890efgh';
  const postId = '1234567890ijkl';
  const senderId = '0987654321abcd';
  const username = 'testusername'
  const promote = true;

  it('Successfully get my groups by userId', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get my groups'}));
    getMyGroups(userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get my groups');
    });
  });

  it('Successfully get public groups', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get public groups'}));
    getPublicGroups().then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get public groups');
    });
  });

  it('Successfully filtered the groups', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully filtered the groups'}));
    filterGroupsByTag(tag).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully filtered the groups');
    });
  });

  it('Successfully created the group', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully created the group'}));
    createGroup(userId, title, status).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully created the group');
    });
  });

  it('Successfully get the group', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get the group'}));
    getGroupById(groupId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get the group');
    });
  });

  it('Successfully get the posts', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get the posts'}));
    getPostsByGroupId(groupId, userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get the posts');
    });
  });

  it('Successfully get the post', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get the post'}));
    getPostById(postId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get the post');
    });
  });

  it('Successfully invited the user', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get the post'}));
    inviteUser(groupId, userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get the post');
    });
  });

  it('Successfully sent invite user message', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully sent invite user message'}));
    inviteUserMessage(groupId, senderId, userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully sent invite user message');
    });
  });

  it('Successfully accepted the user', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully accepted the user'}));
    acceptUser(groupId, userId, senderId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully accepted the user');
    });
  });

  it('Successfully added the tag', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully added the tag'}));
    addTag(groupId, userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully added the tag');
    });
  });

  it('Successfully get the user', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get the user'}));
    getUsersByName(username).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get the user');
    });
  });

  it('Successfully get the user', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get the user'}));
    getUserById(userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get the user');
    });
  });

  it('Successfully leave group', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 204, description: 'Successfully leave group'}));
    getUsersByName(groupId, userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(204);
      expect(data.description).toBe('Successfully leave group');
    });
  });

  it('Successfully deleted post', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully deleted post'}));
    deletePost(postId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully deleted post');
    });
  });

  it('Successfully promoted admin', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 204, description: 'Successfully promoted admin'}));
    promoteAdmin(groupId, userId, promote).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(204);
      expect(data.description).toBe('Successfully promoted admin');
    });
  });

  it('Successfully hide post', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 204, description: 'Successfully hide post'}));
    hidePost(postId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(204);
      expect(data.description).toBe('Successfully hide post');
    });
  });

  it('Successfully flag post', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 204, description: 'Successfully flag post'}));
    flagPost(postId, userId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(204);
      expect(data.description).toBe('Successfully flag post');
    });
  });

  it('Successfully get posts', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get posts'}));
    getFlaggedPosts(groupId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get posts');
    });
  });

  it('Successfully get posts', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully get posts'}));
    filterPostsByHashTag(tag, groupId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully get posts');
    });
  });
});


