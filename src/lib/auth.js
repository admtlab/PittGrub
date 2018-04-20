import { AsyncStorage } from 'react-native';


export async function getToken() {
  const token = await AsyncStorage.getItem('jwt');
  return JSON.parse(token);
}

export async function storeToken(token) {
  AsyncStorage.setItem('jwt', JSON.stringify(token));
}

export async function deleteToken() {
  AsyncStorage.removeItem('jwt');
}

export async function getUser() {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
}

export async function storeUser(user) {
  user = JSON.stringify(user);
  AsyncStorage.setItem('user', user);
}

export async function deleteUser() {
  AsyncStorage.removeItem('user');
}

export async function getProfile() {
  const profile = await AsyncStorage.getItem('profile');
  return JSON.parse(profile);
}

export async function storeProfile(profile) {
  profile = JSON.stringify(profile);
  AsyncStorage.setItem('profile', profile);
}

export async function deleteProfile() {
  AsyncStorage.removeItem('profile');
}

export async function activateUser() {
  const active = JSON.stringify({ active: true });
  AsyncStorage.mergeItem('user', active);
}

export async function setStatus(status) {
  AsyncStorage.mergeItem('user', JSON.stringify({ status: status }));
}

export async function setFoodPreferences(foodPreferences) {
  const foodPrefs = JSON.stringify({ foodPreferences: foodPreferences });
  AsyncStorage.mergeItem('user', foodPrefs);
}

export async function clearAll() {
  deleteToken();
  deleteUser();
  deleteProfile();
}
