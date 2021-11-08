import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
// import { Router } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
// import { createMemoryHistory } from 'history';
import mockServer from '../common/mockServer.test';
import GroupListItem from './Groups';

describe('Displays single group list item', () => {
  beforeAll(() => { mockServer.listen(); });
  afterAll(() => { mockServer.close(); });
  beforeEach(() => {
    act(() => {
      render(
        <GroupListItem
          name="my group"
        />,
      );
    });
  });

  test('renders join button', async () => {
    const joinButton = await screen.getByText(/Join Group/);
    expect(joinButton).toBeInTheDocument();
  });

  test('renders group name', async () => {
    const joinButton = await screen.getByText(/my group/);
    expect(joinButton).toBeInTheDocument();
  });
});
