/* @flow */

import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import images from '../config/images';
import { getToken, getUser } from '../lib/auth';


// screen dimensions
var { width, height } = Dimensions.get('window');


export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activationCode: '',
    };

    this._checkActivation = this._checkActivation.bind(this);
  }

  _checkActivation = () => {
    // Check which page the app should be on
    getUser()
      .then((user) => {
        if (user !== null && user !== undefined) {
          // user is signed in
          if (user.activated) {
            // user is activated
            getToken()
              .then((token) => {
                if (token !== null && token !== undefined) {
                  // Token found, send user to home page
                  this.props.navigation.navigate('Home');
                }
              });
          } else if (user.activated !== null && user.activated !== undefined) {
            // User is signed in, but hasn't activated their account
            // send user to verification page so they can enter their code
            this.props.navigation.navigate('Verification');
          }
        }
        // Either user is not signed in, or their token wasn't found
        // Keep user on Welcome screen, since they'll have to log in or sign up
      });
  }

  render() {
    this._checkActivation();
    return (
      <View style={styles.view}>
        <Image source={images.enter} style={styles.backgroundImage}>
          <Text>{"\n\n\n\n"}{"\n\n\n\n"}</Text>
          <Button text="LOG IN"
            onPress={() => this.props.navigation.navigate('Login')}
            buttonStyle={styles.button}
            textStyle={styles.buttonText} />
          <Button text="SIGN UP"
            onPress={() => this.props.navigation.navigate('Signup')}
            buttonStyle={styles.button}
            textStyle={styles.buttonText} />
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    width: width - 100,
    height: 60
  },
  buttonText: {
    fontSize: width / 18,
  }
});
