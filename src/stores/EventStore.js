import { action, computed, observable } from 'mobx';
import { getEvents, parseEvents } from '../api/event';

export default class EventStore {
  tokenStore;
  @observable events = [];

  constructor(tokenStore) {
    this.tokenStore = tokenStore;
  }

  @computed get accepted() {
    return this.events.slice().filter(e => e.accepted);
  }

  @computed get recommended() {
    return this.events.slice().filter(e => e.recommended);
  }

  @computed get openRecommended() {
    return this.events.slice().filter(e => e.recommended && !e.accepted);
  }

  @computed get eventSections() {
    if (!this.accepted.length && !this.openRecommended.length) {
      return [];
    }
    return [
      {
        title: `Interested (${this.accepted.length})`,
        data: this.accepted.slice(),
      }, {
        title: `Recommended (${this.openRecommended.length})`,
        data: this.openRecommended.slice(),
      },
    ];
  }

  @action setEvents(newEvents = []) {
    this.events.splice(0, this.events.length, ...newEvents);
  }

  @action addEvent(newEvent) {
    this.events.push(newEvent);
  }

  getById(id) {
    return this.events.find(e => e.id === id);
  }

  fetchEvents() {
    this.tokenStore.getOrFetchAccessToken()
      .then(getEvents)
      .then(parseEvents)
      .then((events) => {
        events.push({
          id: 20000,
          image: require('../../assets/mockpizza.jpg'),
          title: 'Great Pizza for Everyone',
          description: 'Free pizza at the William Pitt Union!',
          address: '500 Grant Street',
          location: '12th Floor Conference Room',
          start_date: new Date(),
          end_date: new Date(),
          organizer_name: 'Mark Silvis',
          organizer_affiliation: 'Department of Computer Science',
          food_preferences: [
            { id: 1, name: 'Gluten Free' },
            { id: 2, name: 'Dairy Free' },
            { id: 3, name: 'Vegetarian' },
            { id: 4, name: 'Vegan' },
          ],
          accepted: true,
          recommended: false,
        });
        this.setEvents(events);
      });
  }
}
