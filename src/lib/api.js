import settings from '../config/settings';


const TOKEN_ENDPOINT = settings.server.url + '/token';
const SIGNUP_ENDPOINT = settings.server.url + '/signup';
const LOGIN_ENDPOINT = settings.server.url + '/login';
const USER_ENDPOINT = settings.server.url + '/users';
const LOCATION_ENDPOINT = settings.server.url + '/users/location';
const VERIFICATION_ENDPOINT = settings.server.url + '/users/verify';
const PROFILE_ENDPOINT = settings.server.url + '/users/profile';
const PASSWORD_RESET_ENDPOINT = settings.server.url + '/users/password/reset';
const EVENT_ENDPOINT = settings.server.url + '/events';
const ACCEPT_EVENT_ENDPOINT = settings.server.url + '/events/accept';
const BEARER = 'Bearer ';
const REQUEST_TOKEN_ENDPOINT = TOKEN_ENDPOINT + '/request';
const VALIDATE_TOKEN_ENDPOINT = TOKEN_ENDPOINT + '/validate';
const NOTIFICATION_TOKEN_ENDPOINT = TOKEN_ENDPOINT + '/notification';
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export async function getUserProfile(token) {
  return fetch(PROFILE_ENDPOINT, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  });
}

export async function postExpoToken(accessToken, userId, token) {
  return fetch(NOTIFICATION_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    },
    body: JSON.stringify({
      user:  userId,
      token: token,
    }),
  });
}

export async function postSignup(email, password) {
  return fetch(SIGNUP_ENDPOINT, {
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

export async function postTokenRequest(token) {
  return fetch(REQUEST_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token
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

export async function getVerification(token) {
  return fetch(VERIFICATION_ENDPOINT, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  });
}

export async function postVerification(token, code) {
  return fetch(VERIFICATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({ code: code }),
  });
}

export async function postLocation(token, latitude, longitude) {
  return fetch(LOCATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude,
    })
  });
}

export async function postProfile(token, foodPrefs, pantry) {
  return fetch(PROFILE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      food_preferences: foodPrefs,
      pantry: pantry
    })
  });
}

export async function postSettings(token, settings) {
  /* possible settings keys
   * eagerness - eagerness value
   * pantry - pitt pantry value
   * food_preferences - ids of update food preferences
  */
  return fetch(PROFILE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
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

export async function getEvents(token) {
  return fetch(EVENT_ENDPOINT, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  });
}

export async function postEvent(token, body) {
  return fetch(EVENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(body)
  })
}

export async function postAcceptEvent(token, eventId) {
  return fetch(ACCEPT_EVENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({ event_id: eventId })
  });
}

export async function postTokenValidation(token) {
  return fetch(VALIDATE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token }),
  });
}

async function getRequestSecure(endpoint, token) {
  return fetch(endpoint, {
    method: 'GET',
    headers: Object.assign({'Authorization': 'Bearer ' + token}, headers)
  });
}

async function postRequestSecure(Endpoint, token) {
  return fetch(endpoint, {
    method: 'POST',
    headers: Object.assign({'Authorization': 'Bearer ' + token}, headers)
  });
}

async function getRequest(endpoint) {
  return fetch(endpoint, {
    method: 'GET',
    headers: headers
  });
}

async function postRequest(endpoint) {
  return fetch(endpoint, {
    method: 'POST',
    headers: headers
  });
}
