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
import userReducer from '../common/userSlice';
import modalReducer from '../common/MessageModal/modalSlice';

describe('Home page', () => {
  const mockServer = setupServer(
    rest.get('/api/user/12345678901234567890abcd',
      (req, res, ctx) => res(ctx.json({
        username: 'testUser',
        createdAt: 'testTime',
      }))),
    rest.delete('/api/user/12345678901234567890abcd',
      (req, res, ctx) => res(ctx.status(204))),
  );

  beforeAll(() => {
    mockServer.listen();
  });

  afterAll(() => {
    mockServer.close();
  });

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
          <Router history={createMemoryHistory({ initialEntries: ['/login'] })}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container)
      .toMatchSnapshot();
  });

  test('should show default welcome page before log-in', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const store = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
    });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const loginButton = await screen.findByRole('button', { name: /Sign In/i });
    await screen.findByRole('button', { name: /Sign Up/i });
    act(() => {
      userEvent.click(loginButton);
    });
    await waitFor(() => {
      expect(history.location.pathname)
        .toEqual('/login');
    });
  });

  test('should show user profile page after log-in', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const store = configureStore({
      reducer: {
        modal: modalReducer,
        user: userReducer,
      },
      preloadedState: { user: { id: '12345678901234567890abcd' } },
    });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    await screen.findByText(/Welcome Back/i);
    const deactivateButton = await screen.findByRole('button', { name: /Deactivate Account/i });
    act(() => {
      userEvent.click(deactivateButton);
    });
    await screen.findByText(/Successfully deactivated/i);
  });
});
