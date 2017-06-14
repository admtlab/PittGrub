import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from './Containers/Route'
import Home from './Containers/Home'

export default class App extends React.Component {

  render() {
    return (
      <Tabs />
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
