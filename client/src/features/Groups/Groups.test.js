import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import mockServer from '../common/mockServer.test';
import App from '../../App';
import store from '../common/store';

describe('Groups page', () => {
  beforeAll(() => {
    mockServer.listen();
  });
  afterAll(() => {
    mockServer.close();
  });

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
    expect(container)
      .toMatchSnapshot();
  });

  test('renders groups', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const group1 = await screen.getByText('Group Name');
    const group2 = await screen.getByText('Group Name 2');
    const group3 = await screen.getByText('Group Name 3');
    expect(group1)
      .toBeInTheDocument();
    expect(group2)
      .toBeInTheDocument();
    expect(group3)
      .toBeInTheDocument();
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

    const inputName = await screen.findByPlaceholderText('Enter group name');
    act(() => {
      userEvent.type(inputName, 'Group Name 4');
    });

    const submitBtn = await screen.findByRole('button', { name: 'Create' });
    act(() => {
      userEvent.click(submitBtn);
    });

    /*
    const group4 = await screen.getByText('Group Name 4');
    expect(group4).toBeInTheDocument();
    */
  });
});

describe('Group page', () => {
  beforeAll(() => {
    mockServer.listen();
  });
  afterAll(() => {
    mockServer.close();
  });

  const history = createMemoryHistory({ initialEntries: ['/group'] });

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
    expect(container)
      .toMatchSnapshot();
  });

  test('renders group', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
      );
    });
    const groupName = await screen.getByText(/Group Name/);
    expect(groupName)
      .toBeInTheDocument();
    const groupPostTitle1 = await screen.getByText(/0/);
    const groupPostTitle2 = await screen.getByText(/1/);
    expect(groupPostTitle1)
      .toBeInTheDocument();
    expect(groupPostTitle2)
      .toBeInTheDocument();
  });
});
