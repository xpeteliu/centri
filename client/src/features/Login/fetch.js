// const url = 'https://cis557-group20-project.herokuapp.com';
const url = '';

export const postLogin = (username, password) => fetch(`${url}/api/user/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username, password }),
});
