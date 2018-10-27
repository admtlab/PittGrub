import { action, observable } from 'mobx';


export default class FeatureStore {
  @observable features = {
    createEvent: null,
    notifications: null,
    location: null,
    camera: null,
  };

  @action setFeatures(newFeatures) {
    this.features = {...this.features, ...newFeatures};
  }
}
