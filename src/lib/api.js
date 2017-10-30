import { getToken } from './auth';
import settings from '../config/settings';


const TOKEN_ENDPOINT = settings.server.url + '/token';
const SIGNUP_ENDPONT = settings.server.url + '/signup';
const LOGIN_ENDPOINT = settings.server.url + '/login';
const ACTIVATION_ENDPOINT = settings.server.url + '/users/activate';
const PASSWORD_RESET_ENDPOINT = settings.server.url + '/password/reset';


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

export async function getVerification() {
  let token = await getToken();
  return fetch(ACTIVATION_ENDPOINT, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token.token,
    },
  });
}

export async function postVerification(code) {
  let token = await getToken();
  return fetch(ACTIVATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token.token,
    },
    body: JSON.stringify({ activation: code }),
  });
}

export async function postPasswordReset(email) {
  return fetch(PASSWORD_RESET_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email }),
  });
}
