import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import App from '../../App';

describe('Registration page', () => {
  const mockServer = setupServer(
    rest.post('/user/',
      (req, res, ctx) => (req.body.username === 'duplicateName'
        ? res(ctx.status(409), ctx.json({ message: 'The username has been registered' }))
        : res(ctx.status(204)))),
  );

  const history = createMemoryHistory({ initialEntries: ['/register'] });

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

  test('should properly handle valid registration info', async () => {
    const inputBoxes = await screen.findAllByRole('textbox');
    const submitBtn = await screen.findByRole('button', { name: /sign up/i });
    expect(inputBoxes.length).toEqual(4);
    act(() => {
      userEvent.type(inputBoxes[0], 'testName');
      userEvent.type(inputBoxes[1], 'testName@email.com');
      userEvent.type(inputBoxes[2], 'testPwd');
      userEvent.type(inputBoxes[3], 'testPwd');
      userEvent.click(submitBtn);
    });
    expect(history.location.pathname).toEqual('/login');
  });

  test('should properly handle occupied username', async () => {
    const inputBoxes = await screen.findAllByRole('textbox');
    const submitBtn = await screen.findByRole('button', { name: /sign up/i });
    expect(inputBoxes.length).toEqual(4);
    act(() => {
      userEvent.type(inputBoxes[0], 'duplicateName');
      userEvent.type(inputBoxes[1], 'duplicateName@email.com');
      userEvent.type(inputBoxes[2], 'testPwd');
      userEvent.type(inputBoxes[3], 'testPwd');
      userEvent.click(submitBtn);
    });
    expect(history.location.pathname).toEqual('/register');
  });

  test('should properly handle different passwords for the 2 input boxes', async () => {
    const inputBoxes = await screen.findAllByRole('textbox');
    const submitBtn = await screen.findByRole('button', { name: /sign up/i });
    expect(inputBoxes.length).toEqual(4);
    act(() => {
      userEvent.type(inputBoxes[0], 'testName');
      userEvent.type(inputBoxes[1], 'testName@email.com');
      userEvent.type(inputBoxes[2], 'testPwd');
      userEvent.type(inputBoxes[3], 'diffPwd');
      userEvent.click(submitBtn);
    });
    expect(history.location.pathname).toEqual('/login');
  });
});
