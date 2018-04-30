import { action, computed, observable } from 'mobx';
import { postLogin, postTokenValidation } from '../lib/api';

class TokenStore {
  @observable loading = false;
  @observable error = false;
  @observable errorMessage = '';
  @observable refreshToken = '';
  @observable accessToken = '';
  @observable id;
  @observable email;
  @observable name;
  @observable status;
  @observable roles;
  @observable active;
  @observable disabled;

  @computed get refreshIsValid() {
    return null;
  }

  @computed get accessTokenIsValid() {
    return postTokenValidation(this.accessToken)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      return responseData['valid'] == true;
    })
    .catch(() => {
      return false;
    });
  }

  @action setAccessToken(token) {
    this.accessToken = token;
  }

  @action async fetchRefreshToken(username, password) {
    this.refreshToken = '';
  }

  @action async fetchAccessToken(email, password) {
    this.loading = true;
    postLogin(email, password)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      const user = responseData['user'];
      const token = responseData['token'];
      this.id = user.id;
      this.email = user.email;
      this.name = user.name;
      this.status = user.status;
      this.roles = user.roles;
      this.active = user.active;
      this.disabled = user.disabled;
      this.accessToken = token;
    })
    .catch(response => {
      let responseData = response.json();
      if (responseData['message']) {
        this.errorMessage = responseData['message'];
      } else {
        this.errorMessage = 'Error: something went wrong';
      }
      this.error = true;
      this.accessToken = '';
    })
    .finally(() => {
      this.loading = false;
    });
  }
}

export default TokenStore;
