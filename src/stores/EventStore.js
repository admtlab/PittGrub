import { action, computed, observable } from 'mobx';

class EventStore {
  @observable events = [];

  @computed get attending() {
    return this.events.filter(e => e.attending);
  }

  @computed get recommended() {
    return this.events.filter(e => e.recommended);
  }

  @computed get openRecommended() {
    return this.events.filter(e => e.recommended && !e.attending);
  }

  @action setEvents(newEvents) {
    this.events.split(0, this.events.length, ...newEvents);
  }
}
