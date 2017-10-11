/* @flow */

import React from 'react';
import { AppState, AppRegistry, StyleSheet } from 'react-native';
import { Notifications } from 'expo';
import { AppNav } from './containers/Route';
// import Welcome from './containers/Welcome';
import sleep from './lib/sleep';
import { storeToken } from './lib/auth';
import { registerForPushNotifications, handleNotification } from './lib/notifications';


// window size
// var { width, height } = Dimensions.get('window')


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isReady: false,
      appState: null,
      notification: {},
    };

    this._handleNotification = handleNotification.bind(this);
  };

  static navigationOptions = {
    title: 'Welcome',
  };

  componentWillMount() {
    sleep(3000);
    this.setState({ isReady: true, appState: 'active'});
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    // storeToken(null);
    // storeUser(null);
  }

  componentDidMount() {
    // Track app state (active, background)
    AppState.addEventListener('change', state => {
      this.setState({ appState: state });
      console.log('AppState is ', state);
    });
  }

  render() {
    // Register for push notifications to 
    // alert user when they've been accepted
    registerForPushNotifications();

    // Routing starts with AppNav
    return(<AppNav />);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(204, 204, 204, 0.6)',
    paddingHorizontal : 10,
    color:'#333333',
    marginBottom : 10,
    marginRight: 60,
    marginLeft: 40,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20
  }
});

AppRegistry.registerComponent("main", () => App);
