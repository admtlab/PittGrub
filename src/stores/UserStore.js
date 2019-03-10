import { SecureStore } from 'expo';
import { action, computed, observable } from 'mobx';
import { getUserProfile } from '../api/user';


const SecureProps = { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY };


export default class UserStore {
  tokenStore;
  @observable account = {
    id: null,
    email: null,
    name: null,
    status: null,
    active: null,
    disabled: null,
  };
  @observable roles = [];
  @observable pantry = false;
  @observable foodPreferences = [];
  @observable status = 0;
  @observable graduationDate = null;
  @observable latitude = null;
  @observable longitude = null;

  constructor(tokenStore) {
    this.tokenStore = tokenStore;
  }

  @computed get isHost() {
    return this.roles.some(role => role.name === 'Host');
  }

  @computed get isAdmin() {
    return this.roles.some(role => role.name === 'Admin');
  }

  @action setUser(newUser) {
    const user = { ...newUser };
    if (user.roles) {
      this.roles.splice(0, this.roles.length, ...user.roles);
      delete user.roles;
    }
    this.account = { ...this.account, ...user };
  }

  @action clearUser() {
    Object.keys(this.account).forEach((key) => { this.account[key] = null; });
    this.roles.splice(0);
    this.foodPreferences.splice(0);
    this.pantry = false;
    this.status = 0;
    this.graduationDate = null;
    this.latitude = null;
    this.longitude = null;
  }

  @action setProfile(profile) {
    this.pantry = profile.pantry;
    this.foodPreferences = [...profile.foodPreferences];
    this.status = profile.status;
    this.graduationDate = profile.graduationDate;
  }

  @action setLatLong(lat, long) {
    this.latitude = lat;
    this.longitude = long;
  }

  @action removeUser() {
    Object.keys(this.account).forEach((key) => { this.account[key] = null; });
  }

  saveUser = async () => {
    try {
      await SecureStore.setItemAsync('userId', this.account.id, SecureProps);
    } catch (e) {
      console.warn(e);
    }
  }

  loadUserProfile = async () => {
    const token = await this.tokenStore.getOrFetchAccessToken();
    console.log('loading profile');
    getUserProfile(token).then(profile => this.setProfile({
      pantry: profile.pitt_pantry || false,
      foodPreferences: profile.food_preferences.map(f => f.id) || [],
      status: profile.status || 0,
      graduationDate: profile.graduationDate || null,
    })).catch(console.warn);
  }
}
