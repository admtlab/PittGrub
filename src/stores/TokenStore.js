import { Buffer } from 'buffer';
import { action, computed, observable } from 'mobx';
import { postLogin, postTokenValidation, postTokenRequest } from '../lib/api';

class TokenStore {
  @observable loading = false;
  @observable error = false;
  @observable errorMessage = '';
  @observable refreshToken = '';
  @observable accessToken = '';

  @computed get refreshIsValid() {
    return postTokenValidation(this.refreshToken)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      return responseData['valid'];
    })
    .catch(() => {
      return false;
    });
  }

  @computed get accessTokenIsValid() {
    return postTokenValidation(this.accessToken)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      return responseData['valid'];
    })
    .catch(() => {
      return false;
    });
  }

  @computed get parsedAccessToken () {
      return {
        header: JSON.parse(Buffer.from(this.accessToken.split('.')[0], 'base64')),
        payload: JSON.parse(Buffer.from(this.accessToken.split('.')[1], 'base64'))
      }
  }

  @computed get parsedRefreshToken () {
    return {
      header: JSON.parse(Buffer.from(this.refreshToken.split('.')[0], 'base64')),
      payload: JSON.parse(Buffer.from(this.refreshToken.split('.')[1], 'base64'))
    }
  }

  @computed get accessTokenIsExpired() {
    if (!this.accessToken) { return true }
    const parsed = this.parsedAccessToken;
    const exp = parsed.payload.exp;
    const date = new Date(exp*1000);
    return new Date() >= date;
  }

  @action setRefreshToken(token) {
    this.refreshToken = token;
  }

  @action setAccessToken(token) {
    this.accessToken = token;
  }

  @action async fetchRefreshToken(username, password) {
    this.refreshToken = '';
  }

  @action async fetchAccessToken(email, password) {
    this.loading = true;
    postTokenRequest(this.refreshToken)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      const user = responseData['user'];
      const token = responseData['token'];
      action(() => {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.status = user.status;
        this.roles = user.roles;
        this.active = user.active;
        this.disabled = user.disabled;
        this.accessToken = token;
      })
    })
    .catch(response => {
      let responseData = response.json();
      if (responseData['message']) {
        action(() => this.errorMessage = responseData['message']);
      } else {
        action(() => this.errorMessage = 'Error: something went wrong');
      }
      action(() => {
        this.error = true;
        this.accessToken = '';
      })
    })
    .finally(() => {
      action(() => this.loading = false);
    });
  }

  getOrFetchAccessToken = async () => {
    const exp = this.parsedAccessToken.payload.exp;
    if (new Date(exp*1000) <= new Date()) {
      await this.fetchAccessToken();
    }
    return this.accessToken;
  }
}

export default TokenStore;
