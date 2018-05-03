import TokenStore from './TokenStore';
import UserStore from './UserStore';

const tokenStore = new TokenStore();
const userStore = new UserStore();

export default {
  tokenStore: tokenStore,
  userStore: userStore,
}
