import { action, computed, observable } from 'mobx';
import { ListView } from 'react-native';
import { getEvents } from '../lib/api';

class EventStore {
  tokenStore;
  @observable events = [];

  constructor(tokenStore) {
    this.tokenStore = tokenStore;
  }
  
  eventDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
  acceptedDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
  recommendedDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });

  @computed get eventSource() {
    return this.eventDataSource.cloneWithRows(
      this.events.slice()
    );
  }

  @computed get acceptedSource() {
    return this.acceptedDataSource.cloneWithRows(
      this.events.filter(e => e.accepted).slice()
    );
  }

  @computed get accepted() {
    return this.events.filter(e => e.accepted);
  }

  @computed get openRecommendedSource() {
    return this.recommendedDataSource.cloneWithRows(
      this.events.filter(e => e.recommended && !e.accepted).slice()
    );
  }
  
  @computed get openRecommended() {
    return this.events.filter(e => e.recommended && !e.attending);
  }

  @computed get recommended() {
    return this.events.filter(e => e.recommended);
  }

  @action setEvents(newEvents) {
    this.events.splice(0, this.events.length, ...newEvents);
  }

  @action fetchEvents() {
    this.tokenStore.getOrFetchAccessToken()
    .then((accessToken) => {
      getEvents(accessToken)
      .then((response) => {
        if (!response.ok) { throw response }
        return response.json();
      })
      .then((responseData) => {
        const eventViews = responseData['_embedded']['eventViews'];
        this.setEvents(eventViews);
        console.log('fetched');
        console.log(eventViews);
      })
      .catch(error => {
        console.log('Error fetching events in event store');
        console.log(error);
      })
      .done();
    });
  }
}

export default EventStore;
