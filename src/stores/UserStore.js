import { action, computed, observable } from 'mobx';

class UserStore {
  @observable id;
  @observable email;
  @observable name;
  @observable status;
  @observable roles = [];
  @observable active;
  @observable disabled;
  @observable foodPreferences = [];
  @observable pantry;
  @observable eagerness;
  @observable latitude;
  @observable longitude;

  @computed get isHost() {
    return this.roles.some(role => role.name == 'Host');
  }

  @action setUser(user) {
    console.log('setting user');
    console.log(user);
    if (!user) {
      this.id = null;
      this.email = null;
      this.name = null;
      this.status = null;
      this.roles.splice(0, this.roles.length);
      this.active = null;
      this.disabled = null;
    } else {
      this.id = user.id;
      this.email = user.email;
      this.name = user.name;
      this.status = user.status;
      this.roles.splice(
        0,
        this.roles.length,
        ...user.roles);
      this.active = user.active;
      this.disabled = user.disabled;
    }
  }

  @action setProfile(profile) {
    if (!profile) {
      this.foodPreferences.splice(0, this.foodPreferences.length);
      this.pantry = null;
      this.eagerness = null;
    } else {
      this.foodPreferences.splice(
        0,
        this.foodPreferences.length,
        ...profile.foodPreferences);
      this.pantry = profile.pantry;
      this.eagerness = profile.eagerness;
    }
  }
  
  @action setLatLong(lat, long) {
    this.latitude = lat;
    this.longitude = long;
  }
}

export default UserStore;
