import { enableFetchMocks } from 'jest-fetch-mock';
import { FilterCommentsByHashTag,  FilterPostsByHashTag} from './FilterByHashTag';

enableFetchMocks();
const fetch = require('jest-fetch-mock');

const hashtag = 'test';

it('Filter comments by hashtag', async () => {
  fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully filtered the comments'}));
  FilterCommentsByHashTag(hashtag).then((response) =>
  response.json()).then((data) => {
    expect(data.status).toBe(200);
    expect(data.description).toBe('Successfully filtered the comments');
  });
});

it('Filter posts by hashtag', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200, description: 'Successfully filtered the posts'}));
    FilterPostsByHashTag(hashtag).then((response) =>
    response.json()).then((data) => {
      expect(data.status).toBe(200);
      expect(data.description).toBe('Successfully filtered the posts');
    });
  });
