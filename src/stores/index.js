import EventStore from './EventStore';
import FeatureStore from './FeatureStore';
import TokenStore from './TokenStore';
import UserStore from './UserStore';


const featureStore = new FeatureStore();
const tokenStore = new TokenStore();
const eventStore = new EventStore(tokenStore);
const userStore = new UserStore(tokenStore);


export default {
  eventStore: eventStore,
  featureStore: featureStore,
  tokenStore: tokenStore,
  userStore: userStore,
}
