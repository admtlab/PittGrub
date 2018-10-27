import { baseUrl, get, post } from './http';


const LOGIN_ENDPOINT = `${baseUrl}/login`;
const SIGNUP_ENDPOINT = `${baseUrl}/signup`;
const TOKEN_VALIDATION_ENDPOINT = `${baseUrl}/token/validate`;
const REQUEST_TOKEN_ENDPOINT = `${baseUrl}/token/request`;
const VERIFICATION_ENDPOINT = `${baseUrl}/users/verify`;


export async function login(email, password, tokenStore, userStore) {
  return post(LOGIN_ENDPOINT, {
    body: { email, password}
  }).then(response => setUserData(response, tokenStore, userStore));
}

export async function signup(email, password, tokenStore, userStore) {
  return post(SIGNUP_ENDPOINT, {
    body: { email, password}
  }).then(response => setUserData(response, tokenStore, userStore));
}

export async function validateToken(token) {
  return post(TOKEN_VALIDATION_ENDPOINT, {
    body: { token }
  }).then(data => data.valid).catch(() => false);
}

export async function resendVerification(token) {
  return get(VERIFICATION_ENDPOINT, { token });
}

export async function submitVerification(token, code) {
  return post(VERIFICATION_ENDPOINT, {
    token,
    body: { code }
  });
}

export async function fetchAccessToken(refreshToken) {
  return post(REQUEST_TOKEN_ENDPOINT, {
    body: { token: refreshToken }
  });
}

export async function loadData(refreshToken) {
  return fetchAccessToken(refreshToken)
  .then(data => {
    return { user: data.user, token: data.access_token };
  });
}

function setUserData(response, tokenStore, userStore) {
    tokenStore.setRefreshToken(response.refresh_token);
    tokenStore.setAccessToken(response.access_token);
    userStore.setUser(response.user);
    tokenStore.saveRefreshToken();
}
