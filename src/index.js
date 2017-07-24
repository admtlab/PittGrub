/* @flow */

import React from 'react';
import { AppState, Alert, AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Tabs } from './containers/Route'
import { Permissions, Notifications } from 'expo';
import Home from './containers/Home'
import Login from './containers/Login';
import Profile from './containers/Profile';
import settings from './config/settings';
import sleep from './lib/sleep';


const TOKEN_ENDPOINT = settings.server.url + '/users/token';

async function registerForPushNotifications() {
  console.log('check existing status');
  const { existingStatus } = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
  let finalStatus = existingStatus;

  // prompt for permission if not determined
  console.log('not granted');  
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
    finalStatus = status;
  }

  // stop here if permission not granted
  console.log('stop');  
  if (finalStatus !== 'granted') {
    return;
  }

  // get token
  console.log('get token');  
  let token = await Notifications.getExponentPushTokenAsync();

  // POST token to server
  console.log('post to server');  
  return fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      user: global.user_id,
    }),
  });

  console.log('Token: ' + token);
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      notification: {},
    }
  }

  _onNavigationStateChange = (prevState, newState) => {
    this.setState({...this.state, route_index: newState.index});
  }

  componentWillMount() {
    sleep(3000);
    this.setState({ isReady: true, appState: 'active'});
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  componentDidMount() {
    AppState.addEventListener('change', state => {
      this.setState({ appState: state });
      console.log('AppState is ', state);
    });
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
    if (this.state.appState == 'active') {
      Alert.alert(
          'New event: ' + notification.title,
          'body: ' + notification.body + '  data: ' + notification.data,
          {text: 'OK'});
        // Notifications.scheduleLocalNotificationAsync(this.state.notification, {time: Date().getTime()+5000});
    } else {
      Notifications.presentLocalNotificationAsync(this.state.notification);
    }
    // Notifications.getBadgeNumberAsync()
    //   .then((badgeCount) => 
    //     Notifications.setBadgeNumberAsync(badgeCount+1));
  }

  render() {
    return(
      <Tabs 
        onNavigationStateChange = {(prevState, newState) => {
          this._onNavigationStateChange(prevState, newState);
        }}
        screenProps = { this.state }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent("main", () => App);
