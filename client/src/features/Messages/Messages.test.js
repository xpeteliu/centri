import React from 'react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { configureStore } from '@reduxjs/toolkit';
import App from '../../App';
import Conversation from './Conversation';
import userReducer from '../common/userSlice';
import modalReducer from '../common/MessageModal/modalSlice';

describe('Messages page', () => {
  const user1Id = '12345678901234567890abcd';
  const user2Id = '12345678901234567890efgh';

  const testGroup = {
    _id: '1234a',
    creatorId: user1Id,
    adminIds: [user1Id],
    memberIds: [user2Id],
  };

  const message1 = {
    _id: '1234a',
    content: 'message 1 text',
    senderId: user1Id,
    recipientId: user2Id,
    attachmentType: 'none',
  };

  const message2 = {
    _id: '1234b',
    content: 'message 2 text',
    senderId: user2Id,
    recipientId: user1Id,
    attachmentType: 'none',
  };

  const message3 = {
    _id: '1234c',
    content: 'message 3 text',
    senderId: user1Id,
    recipientId: user2Id,
    invitingGroupId: '1234group1234abc',
    attachmentType: 'none',
  };

  const message4 = {
    _id: '1234d',
    content: 'message 3 text',
    senderId: user1Id,
    recipientId: user2Id,
    invitingGroupId: '1234group1234abc',
    attachmentType: 'image',
    attachmentId: '1234a',
  };

  const message5 = {
    _id: '1234e',
    content: 'message 3 text',
    senderId: user1Id,
    recipientId: user2Id,
    invitingGroupId: '1234group1234abc',
    attachmentType: 'audio',
    attachmentId: '1234b',
  };

  const message6 = {
    _id: '1234f',
    content: 'message 3 text',
    senderId: user1Id,
    recipientId: user2Id,
    invitingGroupId: '1234group1234abc',
    attachmentType: 'video',
    attachmentId: '1234c',
  };

  const mockServer = setupServer(
    rest.get('/api/user/12345678901234567890abcd',
      (req, res, ctx) => res(ctx.json({
        _id: user1Id,
        username: 'testUser1',
      }))),
    rest.get('/api/user/12345678901234567890efgh',
      (req, res, ctx) => res(ctx.json({
        _id: user2Id,
        username: 'testUser2',
      }))),
    rest.post('/api/message/filter/paginate',
      (req, res, ctx) => res(ctx.json(
        [message1, message2, message3, message4, message5, message6]
      ))),
    rest.post('/api/group/filter/sort',
      (req, res, ctx) => res(ctx.json(
        [testGroup]
      ))),
  );

  beforeAll(() => { mockServer.listen(); });
  afterAll(() => { mockServer.close(); });

  test('should match snapshot', async () => {
    let container;
    const store = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
    });
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/messages'] })}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container)
      .toMatchSnapshot();
  });

  test('Click on convo', async () => {
    const store = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: user1Id } },
    });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/messages'] })}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const button = await screen.findByText(/testUser2/);
    act(() => {
      userEvent.click(button);
    });
  });

  test('Render convo', async () => {
    const store = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: user1Id } },
    });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/messages'] })}>
            <Conversation
              messages={[
                message1, message2, message3, message4, message5, message6
              ]}
              id={user1Id}
              otherId={user2Id}
              otherName="testUser2"
              onSubmitMessage={null}
              onFileUpload={null}
              onAcceptInvite={null}
              onDeclineInvite={null}
            />
          </Router>
        </Provider>,
      );
    });
    await screen.findByText(/testUser2/);
  });
});