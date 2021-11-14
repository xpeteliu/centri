export const postUser = (username, email, password) => fetch(`${process.env.REACT_APP_API_URL}/user`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    body: JSON.stringify({ username, email, password }),
  },
});
