import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from './Containers/Route'
import Home from './Containers/Home'

export default class App extends React.Component {
  _onNavigationStateChange = (prevState, newState) => {
    this.setState({...this.state, route_index: newState.index});
  }
  render() {
    return (
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
