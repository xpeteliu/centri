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
    rest.post('http://localhost:8000/user',
      (req, res, ctx) => (req.body.username === 'duplicateName'
        ? res(ctx.status(409), ctx.json({ message: 'The username has been registered' }))
        : res(ctx.status(204)))),
  );

  beforeAll(() => { mockServer.listen(); });

  afterAll(() => { mockServer.close(); });

  test('should match snapshot', async () => {
    let container;
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/register'] })}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  test('should properly handle valid registration info', async () => {
    const history = createMemoryHistory({ initialEntries: ['/register'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Register/i });
    const usernameInput = await screen.findByLabelText('Username');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput0 = await screen.findByLabelText('Password');
    const passwordInput1 = await screen.findByLabelText('Verify Password');
    act(() => {
      userEvent.type(usernameInput, 'testName');
      userEvent.type(emailInput, 'testName@email.com');
      userEvent.type(passwordInput0, 'testPwd');
      userEvent.type(passwordInput1, 'testPwd');
      userEvent.click(submitBtn);
    });
    await waitFor(() => { expect(history.location.pathname).toEqual('/login'); });
  });

  test('should properly handle occupied username', async () => {
    const history = createMemoryHistory({ initialEntries: ['/register'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Register/i });
    const usernameInput = await screen.findByLabelText('Username');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput0 = await screen.findByLabelText('Password');
    const passwordInput1 = await screen.findByLabelText('Verify Password');
    act(() => {
      userEvent.type(usernameInput, 'duplicateName');
      userEvent.type(emailInput, 'duplicateName@email.com');
      userEvent.type(passwordInput0, 'testPwd');
      userEvent.type(passwordInput1, 'testPwd');
      userEvent.click(submitBtn);
    });
    await waitFor(() => { expect(history.location.pathname).toEqual('/register'); });
  });

  test('should properly handle different passwords for the 2 input boxes', async () => {
    const history = createMemoryHistory({ initialEntries: ['/register'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Register/i });
    const usernameInput = await screen.findByLabelText('Username');
    const emailInput = await screen.findByLabelText('Email');
    const passwordInput0 = await screen.findByLabelText('Password');
    const passwordInput1 = await screen.findByLabelText('Verify Password');
    act(() => {
      userEvent.type(usernameInput, 'duplicateName');
      userEvent.type(emailInput, 'duplicateName@email.com');
      userEvent.type(passwordInput0, 'testPwd');
      userEvent.type(passwordInput1, 'diffPwd');
      userEvent.click(submitBtn);
    });
    expect(await screen.findByText(/Invalid Input/i)).toBeInTheDocument();
  });
});
