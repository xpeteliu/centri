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
  beforeAll(() => { mockServer.listen(); });
  afterAll(() => { mockServer.close(); });

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

  test('should match snapshot', async () => {
    let container;
    act(() => {
      ({ container } = render(
        <Provider store={store}>
          <Router history={createMemoryHistory({ initialEntries: ['/group/:groupId'] })}>
            <App />
          </Router>
        </Provider>,
      ));
    });
    expect(container).toMatchSnapshot();
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
});
