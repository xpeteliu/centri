import React from 'react';
import {
  act, render,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import mockServer from '../common/mockServer.test';
import App from '../../App';
import store from '../common/store';

describe('Posts page', () => {
  beforeAll(() => {
    mockServer.listen();
  });
  afterAll(() => {
    mockServer.close();
  });

  const history = createMemoryHistory({ initialEntries: ['/posts'] });

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
});
