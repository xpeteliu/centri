import React from 'react';
import { render, screen } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import store from './features/common/store';
import App from './App';

test('renders create group button', () => {
  render(<App />);
  const button = screen.getByText('Create Group');
  expect(button).toBeInTheDocument();
});

// test('renders learn react link', () => {
//   const { getByText } = render(
//     <Provider store={store}>
//       <App />
//     </Provider>,
//   );

//   expect(getByText(/learn/i)).toBeInTheDocument();
// });
