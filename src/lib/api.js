import { getToken } from './auth';
import settings from '../config/settings';


const TOKEN_ENDPOINT = settings.server.url + '/token';
const SIGNUP_ENDPONT = settings.server.url + '/signup';
const LOGIN_ENDPOINT = settings.server.url + '/login';
const VERIFICATION_ENDPOINT = settings.server.url + '/users/verify';
const PROFILE_ENDPOINT = settings.server.url + '/users/profile';
const SETTINGS_ENDPOINT = settings.server.url + '/users/settings';
const PASSWORD_RESET_ENDPOINT = settings.server.url + '/password/reset';


export async function getUserProfile() {
  return fetch(PROFILE_ENDPOINT, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token.token,
    },
  });
}

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
  return fetch(VERIFICATION_ENDPOINT, {
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
  return fetch(VERIFICATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token.token,
    },
    body: JSON.stringify({ activation: code }),
  });
}

export async function postSettings(settings) {
  /* possible settings keys
   * eagerness - eagerness value
   * pantry - pitt pantry value
   * food_preferences - ids of update food preferences
  */
  let token = await getToken();
  return fetch(SETTINGS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token.token,
    },
    body: JSON.stringify(settings),
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
