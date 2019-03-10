import Logo from '../components/Logo';
import metrics from '../config/metrics';
import { createLink, handleError } from '../common/util';
import { colors, globalStyles } from '../config/styles';
import { Constants, AnimatedRegion } from 'expo';
import PittGrubConstants from '../config/constants';
import React, { Component } from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  Text,
  View
} from 'react-native';


export default class About extends Component {

  state = {
    logoSize: new Animated.Value(metrics.logoSizeSmall),
  };

  admtLabLink = () => createLink('http://db.cs.pitt.edu/group/', 'Advanced Data Management Technologies Lab');

  pittgrubLink = () => createLink(PittGrubConstants.WEBSITE_URL);

  render() {
    return (
      <SafeAreaView style={globalStyles.container}>
        <StatusBar containerStyle={{minHeight: 80}} hidden={false} />
        <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: 20}}>
          <Logo size={this.state.logoSize} />
          <View>
            <Text style={{fontSize: 16}}>
              {'\n'}
              PittGrub was built by {this.admtLabLink()} for the University of Pittsburgh. For more information, please visit our website at {this.pittgrubLink()}.
              {'\n\n'}
              © 2019 University of Pittsburgh
            </Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
          <Text style={{textAlign: 'center'}}>Version {Constants.manifest.version}</Text>
        </View>
      </SafeAreaView>
    );
  }
}
