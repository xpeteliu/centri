import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import mockServer from '../common/mockServer.test';
import App from '../../App';
import store from '../common/store';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../common/userSlice';
import modalReducer from '../common/MessageModal/modalSlice';

describe('Group List page', () => {
  const testGroup = {
    _id: '123',
    title: 'Test Group',
    tags: [],
    status: 'public',
    adminIds: ['1234'],
    memberIds: ['12345'],
    pendingMemberIds: ['123'],
  };

  const mockServerGroupList = setupServer(
    rest.post('/api/group/filter/sort',
      (req, res, ctx) => res(ctx.json([testGroup]))),
    rest.get('/api/group/123',
      (req, res, ctx) => res(ctx.json(testGroup))
    )
  );

  beforeAll(() => { mockServerGroupList.listen(); });
  afterAll(() => { mockServerGroupList.close(); });

  const history = createMemoryHistory({ initialEntries: ['/groups'] });

  test('should match snapshot', async () => {
    let container;
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  test('renders groups, not yet joined', async () => {
    const userStore = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: '123456' } },
    });
    act(() => {
      render(
        <Provider store={userStore}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    expect(await screen.findByText('Test Group')).toBeVisible();
    const joinButton = await screen.findByRole('button', { name: /Join Group/ });
    expect(joinButton).toBeVisible();
    act(() => {
      userEvent.click(joinButton);
    });
    const requestedButton = await screen.findByRole('button', { name: /Requested/ });
    expect(requestedButton).toBeDisabled();
  });

  test('renders groups, already joined', async () => {
    const userStore = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: '1234' } },
    });
    act(() => {
      render(
        <Provider store={userStore}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    expect(await screen.findByText('Test Group')).toBeVisible();
    const requestedButton = await screen.findByRole('button', { name: /Requested/ });
    expect(requestedButton).toBeDisabled();
  });

  test('creates group', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const createBtn = await screen.findByRole('button', { name: /Create Group/ });
    act(() => {
      userEvent.click(createBtn);
    });
    const inputName = await screen.getByPlaceholderText('Enter group name');
    act(() => {
      userEvent.type(inputName, 'Group Name 4');
    });
    const createBtn2 = await screen.findAllByRole('button', { name: /Create Group/ });
    act(() => {
      userEvent.click(createBtn2[1]);
    });
  });

  test('group buttons', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const createBtn = await screen.findByRole('button', { name: /Create Group/ });
    expect(createBtn).toBeVisible();
    const myGroups = await screen.findByRole('button', { name: /My Groups/ });
    expect(myGroups).toBeVisible();
    const publicGroups = await screen.findByRole('button', { name: /My Groups/ });
    expect(publicGroups).toBeVisible();
  });
});

describe('Group/Admin pages', () => {
  const testGroup = {
    _id: '123',
    title: 'Test Group',
    tags: [],
    status: 'public',
    adminIds: ['1234'],
    memberIds: ['12345'],
    pendingMemberIds: ['123'],
  };
  const testPost = {
    _id: '1234',
    groupId: '123',
    heading: 'Test Post',
    creatorId: '1234',
    content: 'Test Content',
    flaggerId: '12345',
  };
  const mockServerGroup = setupServer(
    rest.post('/api/group/filter/sort',
      (req, res, ctx) => res(ctx.json([testGroup]))),
    rest.get('/api/group/123',
      (req, res, ctx) => res(ctx.json(testGroup))
    ),
    rest.post('/api/posting/filter/paginate',
      (req, res, ctx) => res(ctx.json([testPost]))
    ),
    rest.get('/api/posting/1234',
      (req, res, ctx) => res(ctx.json(testPost))
    ),
  );
  beforeAll(() => { mockServerGroup.listen(); });
  afterAll(() => { mockServerGroup.close(); });

  test('should match snapshot', async () => {
    let container;
    const history = createMemoryHistory({ initialEntries: ['/group/123'] });
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  test('group page as admin', async () => {
    const userStore = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: '1234' } },
    });
    const history = createMemoryHistory({ initialEntries: ['/group/123'] });
    act(() => {
      render(
        <Provider store={userStore}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    expect(await screen.findByText('Test Group')).toBeVisible();
    const adminButton = await screen.findByRole('button', { name: /Admin/ });
    expect(adminButton).toBeVisible();
    act(() => {
      userEvent.click(adminButton);
    });
  });

  test('group page as non-admin', async () => {
    const userStore = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: '12345' } },
    });
    const history = createMemoryHistory({ initialEntries: ['/group/123'] });
    act(() => {
      render(
        <Provider store={userStore}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    expect(await screen.findByText('Test Group')).toBeVisible();
    expect(await screen.findByText('Test Post')).toBeVisible();
    expect(await screen.findByText('Test Content')).toBeVisible();
    const editButton = await screen.findByRole('button', { name: /Edit Group/ });
    expect(editButton).toBeVisible();
    const analyticsButton = await screen.findByRole('button', { name: /Analytics/ });
    expect(analyticsButton).toBeVisible();
    const createPostButton = await screen.findByRole('button', { name: /Create Post/ });
    expect(createPostButton).toBeVisible();
    const leaveButton = await screen.findByRole('button', { name: /Leave Group/ });
    expect(leaveButton).toBeVisible();
  });

  test('admin page', async () => {
    const userStore = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: '1234' } },
    });
    const history = createMemoryHistory({ initialEntries: ['/group/123/admin'] });
    act(() => {
      render(
        <Provider store={userStore}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    expect(await screen.findByText('Pending Requests')).toBeVisible();
    expect(await screen.findByText('Admins')).toBeVisible();
    expect(await screen.findByText('Members')).toBeVisible();
    expect(await screen.findByText('Flagged Posts')).toBeVisible();
    const demoteButton = await screen.findByRole('button', { name: /Demote/ });
    expect(demoteButton).toBeVisible();
    const deleteFlaggedButton = await screen.findByRole('button', { name: /Delete/ });
    expect(deleteFlaggedButton).toBeVisible();
    const backButton = await screen.findByRole('button', { name: /Back to Group/ });
    expect(backButton).toBeVisible();
    // expect(await screen.findByText('Pending Requests')).toBeVisible();
  });
});
