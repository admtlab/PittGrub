import { loadData, validateToken } from './api/auth';
import { handleNotification } from './api/notification';
import { AppLoading, Asset, Notifications } from 'expo';
import { Provider } from 'mobx-react/native';
import { SafeAreaView, StyleSheet} from 'react-native';
import Route from './config/routes';
import React, { Component } from 'react';
import stores from './stores';

export default class App extends Component {
  constructor (props) {
    super(props);
    
    this.state = {
      notification: {},
      currentScreen: '',
      loaded: false,
      valid: false
    };

    this._loadData = this._loadData.bind(this);
    this._navigationStateChange = this._navigationStateChange.bind(this);
    this._notificationListener = handleNotification.bind(this);
  };

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._notificationListener);
  }

  componentWillUnmount() {
    this._notificationSubscription.remove();
  }

  _loadData = async () => {
    // check refresh token validity
    return stores.tokenStore.loadRefreshToken()
    .then(() => validateToken(stores.tokenStore.refreshToken))
    .then(valid => {
      this.setState({ valid });
      // load data if valid
      if (valid) {
        return loadData(stores.tokenStore.refreshToken)
        .then(data => {
          stores.tokenStore.setAccessToken(data.token);
          stores.userStore.setUser(data.user);
        }).then(() => stores.userStore.loadUserProfile());
      } else {
        return Promise.resolve();
      }
    });
  }

  _loadResources = async () => {
    return Promise.all([
      this._loadData(),
      Asset.loadAsync([require('../assets/background-dark.png')])
    ]);
  }

  _navigationStateChange = (route) => {
    if (route.hasOwnProperty('index')) {
      this._navigationStateChange(route.routes[route.index]);
    } else {
      console.log(`Navigated to: ${route.routeName}`)
      this.setState({ currentScreen : route.routeName });
     }
  }

  render () {
    if (!this.state.loaded) {
      // prepare app until loaded
      return (
        <AppLoading
          startAsync={this._loadResources}
          onFinish={() => this.setState({ loaded: true })}
          onError={console.warn} />
      );
    }

    // launch app
    console.log('Launching app...');
    console.log(`Session valid? ${this.state.valid}`);
    return (
      <Provider {...stores}>
        <Route
          screenProps={{validSession: this.state.valid}} //, notification: this.state.notification}}
          onNavigationStateChange={this._navigationStateChange} />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
