import { action, computed, observable } from 'mobx';


export default class EventStore {
  tokenStore;
  @observable events = [];

  constructor(tokenStore) {
    this.tokenStore = tokenStore;
  }

  // rowHasChanged = (r1, r2) => r1.id !== r2.id;

  // eventDataSource = new ListView.DataSource({ rowHasChanged: this.rowHasChanged });
  // acceptedEventDataSource = new ListView.DataSource({ rowHasChanged: this.rowHasChanged });
  // recommendedEventDataSource = new ListView.DataSource({ rowHasChanged: this.rowHasChanged });

  // @computed get events() {
  //   return this.events;
  // }

  // @computed get eventSource() {
  //   return this.eventDataSource.cloneWithRows(this.events().slice());
  // }
  
  @computed get accepted() {
    return this.events.slice().filter(e => e.accepted);
  }

  // @computed get acceptedSource() {
  //   return this.acceptedEventDataSource.cloneWithRows(this.accepted().slice());
  // }

  @computed get recommended() {
    return this.events.slice().filter(e => e.recommended);
  }
    
  // @computed get recommendedSource() {
  //   return this.recommendedEventDataSource.cloneWithRows(this.recommended().slice());
  // }

  @computed get openRecommended() {
    return this.events.slice().filter(e => e.recommended && !e.accepted);
  }

  // @computed openRecommendedSource() {
  //   return this.recommendedEventDataSource.cloneWithRows(this.openRecommended().slice());
  // }

  @computed get eventSections() {
      return [
        {
          title: `Interested (${this.accepted.length})`,
          data: this.accepted.slice()
        }, {
          title: `Recommended (${this.openRecommended.length})`,
          data: this.openRecommended.slice()
        },
      ];
  }

  @action setEvents(newEvents) {
    newEvents = newEvents || [];
    this.events.splice(0, this.events.length, ...newEvents);
  }

  @action fetchEvents() {
    // this.tokenStore.getOrFetchAccessToken()
    //   .then(response => {
      //     if (!response.ok) { throw response };
      //     return response.json();
      //   }).then(data => this.setEvents(data._embedded.eventViews))
      //   .catch(() => this.setEvents([]));
      
    console.log('setting events');
    this.setEvents([
      {
        id: 1,
        title: 'Great Pizza for Everyone',
        description: 'Free pizza at the William Pitt Union!',
        address: '500 Grant Street',
        location: '12th Floor Conference Room',
        start_date: new Date(),
        end_date: new Date(),
        food_preferences: [
          { id: 1, name: 'Gluten Free' },
          { id: 2, name: 'Dairy Free' },
          { id: 3, name: 'Vegetarian' },
          { id: 4, name: 'Vegan' },
        ],
        accepted: true,
        recommended: false,
      }, {
        id: 2,
        title: 'Sodexo 365 giveaway',
        description: 'Grab a soba noodle bowl',
        address: '4200 Fifth Ave.',
        location: 'Market Central',
        start_date: new Date(),
        end_date: new Date(),
        food_preferences: [
          { id: 1, name: 'Gluten Free' },
        ],
        accepted: false,
        recommended: false,
      }, {
        id: 3,
        title: 'Coffee',
        description: 'Fresh coffee by Litchfield Towers',
        address: 'Litchfield Towers',
        location: 'Lobby',
        start_date: new Date(),
        end_date: new Date(),
        food_preferences: [
        ],
        accepted: false,
        recommended: true,
      }, {
        id: 4,
        title: 'Another fun event that you surely will want to attend',
        description: 'Looks good, right?',
        address: '500 Grant Street',
        location: '12th Floor Conference Room',
        start_date: new Date(),
        end_date: new Date(),
        food_preferences: [
          { id: 3, name: 'Vegetarian' },
          { id: 4, name: 'Vegan' },
        ],
        accepted: true,
        recommended: true,
      },
    ]);
  }
}
