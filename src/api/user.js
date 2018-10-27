import { baseUrl, get } from './http';


const PROFILE_ENDPOINT = `${baseUrl}/users/profile`;


export async function getUserProfile(token) {
  return get(PROFILE_ENDPOINT, { token }).catch(() => {});
}
