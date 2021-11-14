import React from 'react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import mockServer from '../common/mockServer.test';
import App from '../../App';
import store from '../common/store';

describe('Login page', () => {
  beforeAll(() => { mockServer.listen(); });

  afterAll(() => { mockServer.close(); });

  test('should match snapshot', async () => {
    let container;
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/login'] })}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  test('should properly handle valid inputs', async () => {
    const history = createMemoryHistory({ initialEntries: ['/login'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Login/i });
    const usernameInput = await screen.findByLabelText('Username');
    const passwordInput = await screen.findByLabelText('Password');
    act(() => {
      userEvent.type(usernameInput, 'testName');
      userEvent.type(passwordInput, 'testPwd');
      userEvent.click(submitBtn);
    });
    await waitFor(() => { expect(history.location.pathname).toEqual('/'); });
    expect(document.cookie).toMatch(/connect\.sid=testSid/i);
  });

  test('should reject invalid password', async () => {
    const history = createMemoryHistory({ initialEntries: ['/login'] });
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const submitBtn = await screen.findByRole('button', { name: /Login/i });
    const usernameInput = await screen.findByLabelText('Username');
    const passwordInput = await screen.findByLabelText('Password');
    act(() => {
      userEvent.type(usernameInput, 'testName');
      userEvent.type(passwordInput, 'testPwd');
      userEvent.click(submitBtn);
    });
    expect(history.location.pathname).toEqual('/login');
    // console.log(document.cookie);
  });
});
