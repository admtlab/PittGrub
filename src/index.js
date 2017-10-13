/* @flow */

import React from 'react';
import { AppState, AppRegistry, StyleSheet } from 'react-native';
import { Notifications } from 'expo';
import Route from './config/routes';
// import Welcome from './containers/Welcome';
import sleep from './lib/sleep';
import { storeToken } from './lib/auth';
import { registerForPushNotifications, handleNotification } from './lib/notifications';


// window size
// var { width, height } = Dimensions.get('window')


class App extends React.Component {
  constructor(props) {
    super(props);

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

  _onNavigationStateChange = (prevState, newState) => {
    this.setState({ ...this.state, route_index: newState.index });
  }

  componentWillMount() {
    sleep(3000);
    this.setState({ isReady: true, appState: 'active' });
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
    // Register for push notifications early to 
    // alert user when they've been accepted
    // May be too early here
    // registerForPushNotifications();

    // Routing starts with AppNav
    return (<Route
      onNavigationStateChange={(prevState, newState) => {
        this._onNavigationStateChange(prevState, newState);
      }}
      screenProps={this.state}
    />);
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
    paddingHorizontal: 10,
    color: '#333333',
    marginBottom: 10,
    marginRight: 60,
    marginLeft: 40,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20
  }
});

AppRegistry.registerComponent("main", () => App);
