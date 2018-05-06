/* @flow */

import React from 'react';
import { AppState, Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { NavigationActions } from 'react-navigation';
import { Button } from '../components/Button';
import images from '../config/images';
import { postTokenValidation, postTokenRequest, getUserProfile } from '../lib/api';
import { deleteRefreshToken, getRefreshToken, getAccessToken, storeAccessToken } from '../lib/token';
import { getUser, getProfile, removeProfile, removeUser, storeProfile, storeUser } from '../lib/user';


// screen dimensions
const { width, height } = Dimensions.get('window');

@inject("tokenStore", "userStore")
@observer
export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navigate: '',
    };
    this._checkNavigation = this._checkNavigation.bind(this);
    this._appStateHandler = this._appStateHandler.bind(this);
  }

  componentDidMount() {
    console.log('welcome mounted');
    this._appStateHandler();
    this._checkNavigation();
  }

  _appStateHandler = () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    AppState.addEventListener('change', state => {
      console.log('AppState is', state);
      if (state === 'active') {
        let refreshToken = getRefreshToken().catch(() => '');
        let valid = postTokenValidation(refreshToken)
        .then(response => {
          if (!response.ok) { throw response }
          return response.json();
        })
        .then(responseData => {
          return responseData['valid'];
        })
        .catch(() => {
          return false;
        });
        if (!valid) {
          console.log('refresh is not valid');
          tokenStore.setRefreshToken('');
          tokenStore.setAccessToken('');
          deleteRefreshToken();
          deleteAccessToken();
          removeUser();
          removeProfile();
          this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({ routeName: 'Entrance' })
            ]
          }));
        }
        console.log('refresh is valid');
        tokenStore.setRefreshToken(
          getRefreshToken().catch(() => '').done()
        );
        tokenStore.setAccessToken(
          getAccessToken().catch(() => '').done()
        );
        userStore.setUser(
          getUser().catch(() => null).done()
        );
        userStore.setProfile(
          getProfile().catch(() => null).done()
        );
      }
    });
  }

  _checkNavigation = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;

    // Check which page the app should be on
    console.log("Checking user status");

    // check refresh token
    let refreshToken = tokenStore.refreshToken;
    if (!refreshToken) {
      // not in store, check storage
      refreshToken = await getRefreshToken().catch(() => '').done();
    }
    // not in store or storage
    if (!refreshToken) {
      // they have to log in
      console.log('No refresh token, keep them here');
      return;
    }

    
    let valid = postTokenValidation(refreshToken)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      return responseData['valid'];
    })
    .catch(() => {
      return false;
    });

    if (!valid) {
      tokenStore.setRefreshToken('');
      deleteRefreshToken();
      removeUser();
      removeProfile();
      console.log("refresh token wasn't valid");
      return;
    }

    // check access token
    let accessToken = tokenStore.accessToken;
    if (!accessToken) {
      accessToken = await getAccessToken();
    }
    if (!accessToken || (accessToken && tokenStore.accessTokenIsExpired)) {
      postTokenRequest(refreshToken)
      .then((response) => {
        if (!response.ok) { throw response };
        return response.json();
      })
      .then((responseData) => {
        accessToken = responseData['access_token'];
        const user = responseData['user'];
        tokenStore.setAccessToken(accessToken);
        storeAccessToken(accessToken);
        userStore.setUser(user);
        storeUser(user);
        return user;
      })
      .then((user) => {
        // check user status
        if (user == null || user == undefined || userStore.disabled) {
          console.log(user);
          return;
        } else {
          // get user profile
          getUserProfile(accessToken)
          .then((response) => {
            if (!response.ok) { throw response };
            return response.json();
          })
          .then((responseData) => {
            const food = responseData['food_preferences'].map(fp => fp.id);
            const pantry = responseData['pitt_pantry'];
            const eager = responseData['eagerness'];
            const profile = {
              foodPreferences: food,
              pantry: pantry,
              eagerness: eager
            };
            userStore.setProfile(profile);
            storeProfile(profile);
          })
          // handle correct screen
          if (!user.active) {
            console.log('user is not activated');
            this.props.navigation.navigate('Verification');
          } else {
            console.log('user is good');
            this.props.navigation.navigate('Main');
          }
        }
      })
      .catch(() => false);
    }
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
