import EventStore from './EventStore';
import TokenStore from './TokenStore';
import UserStore from './UserStore';

const tokenStore = new TokenStore();
const eventStore = new EventStore(tokenStore);
const userStore = new UserStore();

export default {
  eventStore: eventStore,
  tokenStore: tokenStore,
  userStore: userStore,
}
