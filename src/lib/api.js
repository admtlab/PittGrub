import settings from '../config/settings';


const TOKEN_ENDPOINT = settings.server.url + '/token';
const SIGNUP_ENDPONT = settings.server.url + '/signup';
const LOGIN_ENDPOINT = settings.server.url + '/login';
const ACTIVATION_ENDPOINT = settings.server.url + '/users/activate';


export async function postExpoToken(userId, token) {
  return fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user:  userId,
      token: token,
    }),
  });
}

export async function postSignup(email, password) {
  return fetch(SIGNUP_ENDPONT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
}

export async function postLogin(email, password) {
  return fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
}

export async function postVerification(code) {
  return fetch(ACTIVATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ activation: code }),
  });
}

