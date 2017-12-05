import { AsyncStorage } from 'react-native';


export async function getUser() {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
}

export async function storeUser(user) {
  user = JSON.stringify(user);
  AsyncStorage.setItem('user', user);
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
