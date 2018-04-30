import { action, computed, observable } from 'mobx';

class UserStore {
  @observable id;
  @observable email;
  @observable name;
  @observable status;
  @observable roles;
  @observable active;
  @observable disabled;

  @computed get isHost() {
    return this.roles.some(role => role.name == 'Host');
  }

  @action setUser(user) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.status = user.status;
    this.roles = user.roles;
    this.active = user.active;
    this.disabled = user.disabled;
  }
}
