export const postUser = (username, email, password, avatarId) => fetch('/api/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username,
    email,
    password,
    avatarId,
  }),
});

export const postFile = (form) => fetch('/api/file', {
  method: 'POST',
  body: form,
});
