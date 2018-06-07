/* @flow */

import { AppLoading, Notifications } from 'expo';
import { Provider } from 'mobx-react/native';
import React from 'react';
import { AppRegistry, SafeAreaView } from 'react-native';
import Route from './config/routes';
import { handleNotification } from './lib/notifications';
import stores from './stores';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: {},
      routeName: 'Welcome',
      loaded: false
    };

    this._handleNotification = handleNotification.bind(this);
  };

  _onNavigationStateChange = (newState) => {
    if (newState.hasOwnProperty('index')) {
      this._onNavigationStateChange(newState.routes[newState.index]);
    } else {
      // set current route
      this.setState({ routeName: newState.routeName })
      console.log('Route: ' + newState.routeName);
    }
  }

  async _cacheResourcesAsync() {
    console.log('preparing cached resources');
    const images = [
      require('../assets/enter.png')
    ];
  }

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  render() {
    if (!this.state.loaded) {
      return(
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ loaded: true })}
          onError={console.warn}
        />
      )
    }
    return (
      <Provider {...stores}>
        <Route screenProps={this.state}
          onNavigationStateChange={(prevState, newState) => this._onNavigationStateChange(newState)}
        />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("main", () => App);
