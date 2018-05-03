import { action, computed, observable } from 'mobx';

class UserStore {
  @observable id;
  @observable email;
  @observable name;
  @observable status;
  @observable roles;
  @observable active;
  @observable disabled;
  @observable foodPreferences = [];
  @observable pantry;
  @observable eagerness;

  @computed get isHost() {
    return this.roles.some(role => role.name == 'Host');
  }

  @action setUser(user) {
    if (!user) {
      this.id = null;
      this.email = null;
      this.name = null;
      this.status = null;
      this.roles = null;
      this.active = null;
      this.disabled = null;
    } else {
      this.id = user.id;
      this.email = user.email;
      this.name = user.name;
      this.status = user.status;
      this.roles = user.roles;
      this.active = user.active;
      this.disabled = user.disabled;
    }
  }

  @action setUserProfile(profile) {
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
}

export default UserStore;
