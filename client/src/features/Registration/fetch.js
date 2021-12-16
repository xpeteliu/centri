export const postUser = (username, email, password) => fetch('/api/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username,
    email,
    password,
  }),
});
