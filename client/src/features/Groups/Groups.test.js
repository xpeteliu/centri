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

describe('Groups page', () => {
  beforeAll(() => { mockServer.listen(); });
  afterAll(() => { mockServer.close(); });

  const history = createMemoryHistory({ initialEntries: ['/groups'] });

  test('should match snapshot', async () => {
    let container;
    act(() => {
      ({ container } = render(
        <Router history={history}>
          <App />
        </Router>,
      ));
    });
    expect(container).toMatchSnapshot();
  });

  test('renders groups', async () => {
    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>,
      );
    });
    const group1 = await screen.getByText(/Group Name/);
    const group2 = await screen.getByText(/Group Name 2/);
    const group3 = await screen.getByText(/Group Name 3/);
    expect(group1).toBeInTheDocument();
    expect(group2).toBeInTheDocument();
    expect(group3).toBeInTheDocument();
  });

  test('creates group', async () => {
    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>,
      );
    });
    expect(group4).not.toBeInTheDocument();
    const createBtn = await screen.findByRole('button', { name: /Create Group/ });
    act(() => {
      userEvent.click(createBtn);
    });
    const inputName = await screen.findAllByRole('groupName');
    act(() => {
      userEvent.type(inputName, 'group4');
    });
    const group4 = await screen.getByText(/Group Name 4/);
    expect(group4).toBeInTheDocument();
  });
});
