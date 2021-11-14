export const getLogin = (username, password) => fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
  headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` },
});
