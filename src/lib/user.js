import { AsyncStorage } from 'react-native';


const HOST = "Host";
const ADMIN = "Admin";

export async function isHost(user) {
  return user.roles.some(role => role.name == HOST);
}

export async function isAdmin(user) {
  return user.roles.some(role => role.name == ADMIN);
}

export async function getUser() {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
  // return Object.assign(new User, JSON.parse(user));
}

export async function storeUser(user) {
  user = JSON.stringify(user);
  AsyncStorage.setItem('user', user);
}

export async function getProfile() {
  const profile = await AsyncStorage.getItem('profile');
  return JSON.parse(profile);
  // return Object.assign(new Profile, JSON.parse(profile));
}

export async function storeProfile(profile) {
  profile = JSON.stringify(profile);
  AsyncStorage.setItem('profile', profile);
}

export async function activateUser() {
  const activated = JSON.stringify({ activated: true });
  AsyncStorage.mergeItem('user', activated);
}

export async function setStatus(status) {
  AsyncStorage.mergeItem('user', JSON.stringify({ status: status }));
}

export async function setFoodPreferences(foodPreferences) {
  const foodPrefs = JSON.stringify({ foodPreferences: foodPreferences });
  AsyncStorage.mergeItem('user', foodPrefs);
}

export async function setEagerness(value) {
  const eagerness = JSON.stringify({ eagerness: value });
  AsyncStorage.mergeItem('user', eagerness);
}

export async function setPantry(value) {
  const pantry = JSON.stringify({ pantry: value });
  AsyncStorage.mergeItem('user', pantry);
}
