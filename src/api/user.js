import { baseUrl, get, post } from './http';


const PROFILE_ENDPOINT = `${baseUrl}/users/profile`;


export async function getUserProfile(token) {
  return get(PROFILE_ENDPOINT, { token }).catch(() => {});
}

export async function updateProfile(token, profile) {
  return post(PROFILE_ENDPOINT, { token, body: profile });
}
