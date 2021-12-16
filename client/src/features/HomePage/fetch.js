export const getUser = (id) => fetch(`/api/user/${id}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const deleteUser = (id) => fetch(`/api/user/${id}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
});
