import { AppLoading, Asset, Notifications } from 'expo';
import { Provider } from 'mobx-react/native';
import React, { Component } from 'react';
import { loadData, validateToken } from './api/auth';
import { handleNotification } from './api/notification';
import Route from './config/routes';
import stores from './stores';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentScreen: '',
      loaded: false,
      valid: false,
    };
    console.log('loading index');

    console.log(props);

    this.loadData = this.loadData.bind(this);
    this.navigationStateChange = this.navigationStateChange.bind(this);
    this.notificationListener = handleNotification.bind(this);
  }

  componentDidMount() {
    this.notificationSubscription = Notifications.addListener(this.notificationSubscription);
  }

  componentWillUnmount() {
    this.notificationSubscription.remove();
  }

  notificationSubscription = (notification) => {
    stores.eventStore.fetchEvents();
    return this.notificationListener(notification, stores.eventStore, stores.tokenStore.refreshToken, stores.userStore.account.id);
  };

  loadData = async () => (
    // check refresh token validity
    stores.tokenStore.loadRefreshToken()
      .then(() => stores.tokenStore.refreshToken && validateToken(stores.tokenStore.refreshToken))
      .then((valid) => {
        this.setState({ valid });
        // load data if valid
        if (valid) {
          return loadData(stores.tokenStore.refreshToken)
            .then((data) => {
              stores.tokenStore.setAccessToken(data.token);
              stores.userStore.setUser(data.user);
            }).then(() => stores.userStore.loadUserProfile());
        }
        return Promise.resolve();
      })
  );

  loadResources = async () => (
    Promise.all([
      this.loadData(),
      Asset.loadAsync([require('../assets/background-dark.png')])
    ])
  );

  navigationStateChange = (route) => {
    if (route.hasOwnProperty('index')) {
      this.navigationStateChange(route.routes[route.index]);
    } else {
      console.log(`Navigated to: ${route.routeName}`);
      this.setState({ currentScreen: route.routeName });
    }
  }

  render() {
    if (!this.state.loaded) {
      // prepare app until loaded
      return (
        <AppLoading
          startAsync={this.loadResources}
          onFinish={() => this.setState({ loaded: true })}
          onError={console.warn}
        />
      );
    }

    // launch app
    return (
      <Provider {...stores}>
        <Route
          screenProps={{ validSession: this.state.valid, currentScreen: this.state.currentScreen }}
          onNavigationStateChange={this.navigationStateChange}
        />
      </Provider>
    );
  }
}
