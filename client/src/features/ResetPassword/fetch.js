export const findUser = (username, email) => fetch('/api/user/filter/paginate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filter: {
      username,
      email,
    },
  }),
});

export const resetPassword = (userId, password) => fetch(`/api/user/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password,
  }),
});
