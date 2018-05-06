import { AsyncStorage } from 'react-native';
import { SecureStore } from 'expo';

const SecureProps = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };

export async function getAccessToken() {
  const token = await AsyncStorage.getItem('accessToken');
  return JSON.parse(token);
}

export async function storeAccessToken(token) {
  return AsyncStorage.setItem('accessToken', JSON.stringify(token));
}

export async function deleteAccessToken() {
  AsyncStorage.removeItem('accessToken');
}

export async function getRefreshToken() {
  const token = await SecureStore.getItemAsync('refreshToken');
  return token === undefined ? null : JSON.parse(token);
}

export async function storeRefreshToken(token) {
  return SecureStore.setItemAsync('refreshToken', JSON.stringify(token), SecureProps);
}

export async function deleteRefreshToken() {
  SecureStore.deleteItemAsync('refreshToken');  
}

export function parseJwt (token) {
  return {
    header:  JSON.parse(window.atob(token.split('.')[0])),
    payload: JSON.parse(window.atob(token.split('.')[1]))
  };
}

export function isValid (token) {
  let parsed = parseJwt(token);
  let exp = parsed.payload.exp;
  let date = new Date(exp*1000);
  return date > new Date();
}
