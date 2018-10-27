import { getUserProfile } from '../api/user';
import { action, computed, observable } from 'mobx';


export default class UserStore {
  tokenStore;
  @observable account = {
    id: null,
    email: null,
    name: null,
    status: null,
    active: null,
    disabled: null
  };
  @observable roles = [];
  @observable foodPreferences = [];
  @observable pantry = null;
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
    console.log(`newUser: ${JSON.stringify(newUser)}`)
    let user = { ...newUser };
    if (user.roles) {
      this.roles.splice(0, this.roles.length, ...user.roles);
      delete user.roles;
    }
    this.account = { ...this.account, ...user };
  }

  @action clearUser() {
    Object.keys(this.account).forEach(key => this.account[key] = null);
    this.roles.splice(0);
    this.foodPreferences.splice(0);
    this.pantry = null;
    this.latitude = null;
    this.longitude = null;
  }

  @action toggleFoodPreference(foodPreference) {
    // try to remove food pantry
    if (!this.foodPreferences.remove(foodPreference)) {
      // if not removed (wasn't present), add it
      this.foodPreferences.push(foodPreference);
    }
  }

  @action togglePantry() {
    console.log(`toggling pantry to ${!this.pantry}`)
    this.pantry = !this.pantry;
  }

  @action setProfile(profile) {
    this.pantry = profile.pantry;
    this.foodPreferences = profile.foodPreferences.splice(
      0,
      this.foodPreferences.length,
      ...profile.foodPreferences);
  }

  @action setLatLong(lat, long) {
    this.latitude = lat;
    this.longitude = long;
  }

  @action removeUser() {
    Object.keys(this.account).forEach(key => this.account[key] = null);
  }

  loadUserProfile = async () => {
    const token = await this.tokenStore.getOrFetchAccessToken();
    getUserProfile(token).then(profile => this.setProfile({
        pantry: profile.pantry || false,
        foodPreferences: profile.foodPreferences || []
      })
    ).catch(console.warn);
  }
}
