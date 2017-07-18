import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Tabs } from './Containers/Route'
import Home from './Containers/Home'


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    }
  }

  _onNavigationStateChange = (prevState, newState) => {
    this.setState({...this.state, route_index: newState.index});
  }

  componentWillMount() {
    sleep(3000);
    this.state.isReady = true;
    // setTimeout(function() {
    // }, 5000);
  }

  // componentDidMount() {
  // }

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
