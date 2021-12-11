// commonly used mock endpoints are implemented here

import { setupServer } from 'msw/node';
import { rest } from 'msw';

test.skip('Suppress Jest warning for empty test file', () => 1);

const mockServer = setupServer(
  // Username: testName; Password: testPwd; mock SID: testSid
  rest.post('/api/user/login',
    (req, res, ctx) => (
      req.body.username === 'testName' && req.body.password === 'testPwd'
        ? res(ctx.json({
          code: 0,
          id: 'abc123abc123',
        }), ctx.cookie('connect.sid', 'testSid'))
        : res(ctx.status(401), ctx.json({
          code: 3,
          message: 'Incorrect password',
        }))
    )),
);

export default mockServer;
