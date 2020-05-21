import { action, observable } from 'mobx';


export default class FeatureStore {
  @observable features = {
    createEvent: null,
    notifications: null,
    location: null,
    camera: null,
  };

  @action setFeatures(newFeatures) {
    console.log('setting features');
    console.log(newFeatures);
    this.features = { ...this.features, ...newFeatures };
    console.log(this.features);
  }
}
