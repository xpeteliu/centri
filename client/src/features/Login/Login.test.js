import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import mockServer from '../common/MockServer.test';
import App from '../../App';

describe('Login page', () => {
  const history = createMemoryHistory({ initialEntries: ['/login'] });

  beforeAll(() => { mockServer.listen(); });

  afterAll(() => { mockServer.close(); });

  beforeEach(() => {
    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>,
      );
    });
  });

  test('should properly handle valid inputs', async () => {
    const inputBoxes = await screen.findAllByRole('textbox');
    const submitBtn = await screen.findByRole('button', { name: /sign in/i });
    expect(inputBoxes.length).toEqual(2);
    act(() => {
      userEvent.type(inputBoxes[0], 'testName');
      userEvent.type(inputBoxes[1], 'testPwd');
      userEvent.click(submitBtn);
    });
    expect(history.location.pathname).toEqual('/home');
    // console.log(document.cookie);
  });

  test('should reject invalid password', async () => {
    const inputBoxes = await screen.findAllByRole('textbox');
    const submitBtn = await screen.findByRole('button', { name: /sign in/i });
    expect(inputBoxes.length).toEqual(2);
    act(() => {
      userEvent.type(inputBoxes[0], 'testName');
      userEvent.type(inputBoxes[1], 'wrongPwd');
      userEvent.click(submitBtn);
    });
    expect(history.location.pathname).toEqual('/login');
    // console.log(document.cookie);
  });
});
