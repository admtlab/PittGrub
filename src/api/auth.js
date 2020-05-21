import { baseUrl, get, post } from './http';


const LOGIN_ENDPOINT = `${baseUrl}/login`;
const SIGNUP_ENDPOINT = `${baseUrl}/signup`;
const HOST_SIGNUP_ENDPOINT = `${SIGNUP_ENDPOINT}/host`;
const HOST_AFFILIATIONS_ENDPOINT = `${HOST_SIGNUP_ENDPOINT}/affiliations`;
const TOKEN_VALIDATION_ENDPOINT = `${baseUrl}/token/validate`;
const REQUEST_TOKEN_ENDPOINT = `${baseUrl}/token/request`;
const VERIFICATION_ENDPOINT = `${baseUrl}/users/verify`;


export async function login(email, password, tokenStore, userStore) {
  return post(LOGIN_ENDPOINT, {
    body: { email, password },
  }).then(response => setUserData(response, tokenStore, userStore));
}

export async function signup(email, password, tokenStore, userStore) {
  return post(SIGNUP_ENDPOINT, {
    body: { email, password },
  }).then(response => setUserData(response, tokenStore, userStore));
}

export async function hostSignup(email, password, name, affiliation, reason, tokenStore, userStore) {
  return post(HOST_SIGNUP_ENDPOINT, {
    body: {
      email,
      password,
      name,
      reason,
      primary_affiliation: affiliation,
    },
  }).then(response => setUserData(response, tokenStore, userStore))
    .catch(err => console.log(err.json()));
}

export async function hostAffiliations() {
  return get(HOST_AFFILIATIONS_ENDPOINT).then(response => response._embedded.primaryAffiliations);
}

export async function validateToken(token) {
  return post(TOKEN_VALIDATION_ENDPOINT, {
    body: { token },
  }).then(data => data.valid).catch(() => false);
}

export async function resendVerification(token) {
  return get(VERIFICATION_ENDPOINT, { token });
}

export async function submitVerification(token, code) {
  return post(VERIFICATION_ENDPOINT, {
    token,
    body: { code },
  });
}

export async function checkGated(token) {
  return resendVerification(token)
    .then(() => false)
    .catch((err) => {
      if (err.status === 403) {
        return true;
      }
      throw err;
    });
}

export async function fetchAccessToken(refreshToken) {
  return post(REQUEST_TOKEN_ENDPOINT, {
    body: { token: refreshToken },
  });
}

export async function loadData(refreshToken) {
  return fetchAccessToken(refreshToken)
    .then(data => ({ user: data.user, token: data.access_token }));
}

function setUserData(response, tokenStore, userStore) {
  tokenStore.setRefreshToken(response.refresh_token);
  tokenStore.setAccessToken(response.access_token);
  userStore.setUser(response.user);
  tokenStore.saveRefreshToken();
}
