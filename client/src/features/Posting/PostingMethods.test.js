import { enableFetchMocks } from 'jest-fetch-mock';
import { MakePost, GetComment, GetPost, DeleteComment } from './PostMethods';

enableFetchMocks();
const fetch = require('jest-fetch-mock');

describe('Post methods api tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const creatorId = '12345678901234567890abcd';
  const groupId = '12345678901234567890efgh';
  const heading = 'test heading';
  const content = 'This is a testing post';
  const attachmentId = null;
  const attachmentType = 'none';
  const postingId = '1234567890ijkl';
  const commentId = '0987654321ijkl';

  it('Successfully create a post', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully created a new post'}));
    MakePost(groupId, heading, creatorId, content, attachmentId, attachmentType).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully created a new post');
    });
  });

  it('Successfully get a post', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successful operation'}));
    GetPost(postingId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successful operation');
    });
  });

  it('Successfully get a comment', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successful operation'}));
    GetComment(commentId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successful operation');
    });
  });

  it('Successfully delete a comment', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 204, description: 'Comment has been removed'}));
    DeleteComment(commentId).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(204);
      expect(data.description).toBe('Comment has been removed');
    });
  });
});



