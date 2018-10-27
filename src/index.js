/* @flow */

import { AppLoading, Asset, Notifications, registerRootComponent } from 'expo';
import { Provider } from 'mobx-react/native';
import React from 'react';
import Route from './config/routes';
import { handleNotification } from './lib/notifications';
import stores from './stores';


export default class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      notification: {},
      routeName: 'Welcome',
      loaded: false
    };
  
    this._handleNotification = handleNotification.bind(this);
  };

  
  _loadResources = async () => {
    return Promise.all([
      Asset.loadAsync([require('../assets/background-dark.png')])
    ]);
  };

  _onNavigationStateChange = (newState) => {
    if (newState.hasOwnProperty('index')) {
      this._onNavigationStateChange(newState.routes[newState.index]);
    } else {
      // set current route
      console.info('Route: ' + newState.routeName);
      this.setState({ routeName: newState.routeName })
    }
  }

  componentDidMount () {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  render () {
    if (!this.state.loaded) {
      // prepare app until loaded
      return (
        <AppLoading startAsync={this._loadResources}
                    onFinish={() => this.setState({ loaded: true })}
                    onError={console.warn} />
      );
    }

    // load app
    return (
      <Provider {...stores}>
        <Route screenProps={this.state}
               onNavigationStateChange={(_, newState) => this._onNavigationStateChange(newState)} />
      </Provider>
    );
  }
}

registerRootComponent(App);
