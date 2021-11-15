// commonly used mock endpoints are implemented here

import { setupServer } from 'msw/node';
import { rest } from 'msw';

test.skip('Suppress Jest warning for empty test file', () => 1);

const mockServer = setupServer(
  // Username: testName; Password: testPwd; mock SID: testSid
  rest.get('http://localhost:8000/user/login',
    (req, res, ctx) => (req.headers.get('Authorization') === 'Basic dGVzdE5hbWU6dGVzdFB3ZA=='
      ? res(ctx.status(204), ctx.cookie('connect.sid', 'testSid')) : res(ctx.status(401))
    )),
);

export default mockServer;
