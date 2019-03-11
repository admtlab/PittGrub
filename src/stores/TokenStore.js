import { Buffer } from 'buffer';
import { SecureStore } from 'expo';
import { action, computed, observable } from 'mobx';
import { fetchAccessToken } from '../api/auth';


const SecureProps = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };


export default class TokenStore {
  @observable refreshToken = '';
  @observable accessToken = '';

  @computed get parsedAccessToken() {
    try {
      return {
        header: JSON.parse(Buffer.from(this.accessToken.split('.')[0], 'base64')),
        payload: JSON.parse(Buffer.from(this.accessToken.split('.')[1], 'base64')),
      };
    } catch (e) {
      console.warn(e);
      return {};
    }
  }

  @computed get accessTokenIsExpired() {
    return this.accessToken === '' || (new Date(this.parsedAccessToken.payload.exp * 1000) <= new Date());
  }

  @action setRefreshToken(token) {
    this.refreshToken = token;
  }

  @action setAccessToken(token) {
    this.accessToken = token;
  }

  @action async loadRefreshToken() {
    try {
      this.refreshToken = await SecureStore.getItemAsync('refreshToken') || '';
      console.log(`loaded refresh token: ${this.refreshToken}`);
    } catch (e) {
      console.warn(`unable to load refresh token: ${JSON.stringify(e)}`);
    }
  }

  @action async clearTokens() {
    this.refreshToken = '';
    this.accessToken = '';
    await this.saveRefreshToken();
  }

  @action async fetchAccessToken() {
    fetchAccessToken(this.refreshToken)
      .then(data => this.setAccessToken(data.access_token))
      .catch(() => this.setAccessToken(''));
  }

  getOrFetchAccessToken = async () => {
    if (this.accessTokenIsExpired) {
      await this.fetchAccessToken();
    }
    return this.accessToken;
  }

  saveRefreshToken = async () => {
    console.log('saving refresh token');
    try {
      await SecureStore.setItemAsync('refreshToken', this.refreshToken, SecureProps);
    } catch (e) {
      console.warn(e);
    }
  }
}
