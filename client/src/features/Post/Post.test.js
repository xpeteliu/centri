import React from 'react';
import {
  act, render, screen,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import mockServer from '../common/mockServer.test';
import App from '../../App';

describe('Posts page', () => {
  beforeAll(() => { mockServer.listen(); });
  afterAll(() => { mockServer.close(); });

  const history = createMemoryHistory({ initialEntries: ['/posts'] });

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
});