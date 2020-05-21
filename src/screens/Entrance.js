import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import Logo from '../components/Logo';
import Slogan from '../components/Slogan';
import images from '../config/images';
import { globalStyles } from '../config/styles';


@inject('userStore')
export default class Entrance extends Component {
  componentDidMount() {
    const valid = this.props.screenProps.validSession;
    const { account } = this.props.userStore;
    if (valid && account.active && !account.disabled) {
      this.props.navigation.navigate('Main');
    }
  }

  loginScreen = () => this.props.navigation.navigate('Login');

  signupScreen = () => this.props.navigation.navigate('Signup');

  render() {
    return (
      <ImageBackground source={images.background} style={globalStyles.backgroundImage}>
        <View style={styles.view}>
          <Logo style={styles.logo} />
          <Slogan />
          <Button
            text="LOG IN"
            onPress={this.loginScreen}
            buttonStyle={[styles.button, { marginTop: 44 }]}
            textStyle={styles.buttonText}
          />
          <Button
            text="CREATE ACCOUNT"
            onPress={this.signupScreen}
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
});
