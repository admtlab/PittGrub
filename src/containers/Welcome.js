/* @flow */

import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import images from '../config/images';
import { getToken, getUser, getUserTest } from '../lib/auth';


// screen dimensions
var { width, height } = Dimensions.get('window');


export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigate: '',
    };

    this._checkActivation = this._checkActivation.bind(this);
  }

  componentWillMount() {
    this._checkActivation();
  }

  _checkActivation = () => {
    // Check which page the app should be on
    console.log("Checking user status");
    // getUser()
    //   .then((user) => console.log("Found user: " + user));
    // const u = await getUserTest();
    // console.log("Found user test: " + u);
    getUser()
      .then((user) => {
        if (user !== null && user !== undefined) {
          // user is signed in
          if (user.active) {
            // user is active
            getToken()
              .then((token) => {
                if (token !== null && token !== undefined) {
                  // Token found, send user to home page
                  this.props.navigation.navigate('Main');
                }
              });
          } else if (user.active !== null && user.active !== undefined) {
            // User is signed in, but hasn't activated their account
            // send user to verification page so they can enter their code
            console.log('User is not activated');
            this.props.navigation.navigate('Verification');
            this.setState({ navigate: 'Verification' });
          }
        } else {
          // Either user is not signed in, or their token wasn't found
          // Keep user on Welcome screen, since they'll have to log in or sign up
          console.log('keep them here, they have to log in');
          this.setState({ navigate: 'Welcome' });
        }
      });
  }

  render() {
    return (
      <View style={styles.view}>
        <ImageBackground source={images.enter} style={styles.backgroundImage}>
          <Text>{"\n\n\n\n"}{"\n\n\n\n"}</Text>
          <Button text="LOG IN"
            onPress={() => this.props.navigation.navigate('Login')}
            buttonStyle={styles.button}
            textStyle={styles.buttonText} />
          <Button text="SIGN UP"
            onPress={() => this.props.navigation.navigate('Signup')}
            buttonStyle={styles.button}
            textStyle={styles.buttonText} />
        </ImageBackground>
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
    height: 50
  },
  buttonText: {
    fontSize: width / 18,
  }
});
