// commonly used mock endpoints are implemented here

import { setupServer } from 'msw/node';
import { rest } from 'msw';

const mockServer = setupServer(
  rest.get('http://localhost:8000/user/login', (req, res, ctx) => res(
    // Username: testName; Password: testPwd; mock SID: testSid
    req.headers.get('Authorization') === 'Basic dGVzdE5hbWU6dGVzdFB3ZA=='
      ? ctx.cookie('connect.sid', 'testSid') : ctx.status(401),
  )),
);

export default mockServer;
