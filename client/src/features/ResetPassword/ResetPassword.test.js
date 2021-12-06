import React from 'react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import { Provider } from 'react-redux';
import App from '../../App';
import store from '../common/store';

describe('Registration page', () => {
  const mockServer = setupServer(
    rest.post('/api/user/filter/paginate',
      (req, res, ctx) => (
        res(ctx.json(req.body.filter.email === 'testName@email.com' ? [{
          _id: 'abc123abc123',
          username: 'testName',
          email: 'testName@email.com',
        }] : []))
      )),
    rest.put('/api/user/:id', (req, res, ctx) => res(ctx.json({
      _id: 'abc123abc123',
      username: 'testName',
      email: 'testName@email.com',
    }))),
  );

  beforeAll(() => {
    mockServer.listen();
  });

  afterAll(() => {
    mockServer.close();
  });

  test('should match snapshot', async () => {
    let container;
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/resetPassword'] })}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container)
      .toMatchSnapshot();
  });

  test('should properly handle valid reset request', async () => {
    const history = createMemoryHistory({ initialEntries: ['/resetPassword'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Reset/i });
    const usernameInput = await screen.findByLabelText('Username');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('New Password');
    act(() => {
      userEvent.type(usernameInput, 'testName');
      userEvent.type(emailInput, 'testName@email.com');
      userEvent.type(passwordInput, 'testPwd');
      userEvent.click(submitBtn);
    });
    await waitFor(() => {
      expect(history.location.pathname)
        .toEqual('/login');
    });
  });

  test('should reject wrong email info', async () => {
    const history = createMemoryHistory({ initialEntries: ['/resetPassword'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Reset/i });
    const usernameInput = await screen.findByLabelText('Username');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('New Password');
    act(() => {
      userEvent.type(usernameInput, 'testName');
      userEvent.type(emailInput, 'wrong@email.com');
      userEvent.type(passwordInput, 'testPwd');
      userEvent.click(submitBtn);
    });
    expect(await screen.findByText(/Unable to Reset Password/i))
      .toBeInTheDocument();
  });
});
