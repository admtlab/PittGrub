/* @flow */

import React from 'react';
import { AppState, Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { NavigationActions } from 'react-navigation';
import { Button } from '../components/Button';
import images from '../config/images';
import { postTokenValidation, postTokenRequest, getUserProfile } from '../lib/api';
import { deleteRefreshToken, deleteAccessToken, getRefreshToken, getAccessToken, storeAccessToken } from '../lib/token';
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
      loaded: false
    };
    this._checkNavigation = this._checkNavigation.bind(this);
    this._appStateHandler = this._appStateHandler.bind(this);
    this._cleanupUser = this._cleanupUser.bind(this);
    this._tokenStoreRefreshTokenIsValid = this._tokenStoreRefreshTokenIsValid.bind(this);
    this._enterApp = this._enterApp.bind(this);
    this._navigateToEntrance = this._navigateToEntrance.bind(this);
  }

  componentDidMount() {
    this._appStateHandler();
    this._checkNavigation();
  }

  _navigateToEntrance() {
    this.setState({ loaded: true });
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: 'Entrance' })
      ]
    }));
  }

  _secureStoreRefreshTokenIsValid = async (navHandler) => {
    // try fetching from storage
    getRefreshToken()
    .then(refreshToken => {
      if (refreshToken !== null) {
        // validate
        postTokenValidation(refreshToken)
        .then(response => {
          if (!response.ok) { throw response }
          return response.json();
        })
        .then(responseData => {
          let valid = responseData['valid'];
          navHandler(valid, refreshToken);
        })
        .catch(() => {
          console.log('error reading refresh token');
          navHandler(false, null);
        })
      } else {
        navHandler(false, null);
      }
    });
  }

  _tokenStoreRefreshTokenIsValid = async (navHandler) => {
    let refreshToken = this.props.tokenStore.refreshToken;
    postTokenValidation(refreshToken)
    .then(response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then(responseData => {
      let valid = responseData['valid'];
      navHandler(valid);
    })
    .catch(() => {
      console.log('error reading refresh token');
      navHandler(false);
    });
  }

  _enterApp() {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    getUser().then(user => userStore.setUser(user));
    getProfile().then(profile => userStore.setProfile);
    tokenStore.getOrFetchAccessToken();
    console.log(this.props);
    this.setState({ loaded: true });
    const routeName = this.props.screenProps.routeName;
    if (!(routeName == 'Home' || routeName == 'Profile' || routeName == 'Events')) {
      this.props.navigation.navigate('Main');
    }
  }

  _cleanupUser() {
    this.props.tokenStore.setRefreshToken('');
    this.props.tokenStore.setAccessToken('');
    deleteRefreshToken();
    deleteAccessToken();
    removeUser();
    removeProfile();
  }

  _appStateHandler = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    AppState.addEventListener('change', state => {
      console.log('AppState is', state);
      if (state === 'active') {
        if (!tokenStore.refreshToken) {
          this._secureStoreRefreshTokenIsValid(valid => {
            if (!valid) {
              this._cleanupUser();
              this._navigateToEntrance();
            } else {
              // refresh token still valid
              console.log('secure stored refresh is still valid');
              getRefreshToken()
              .then(token => tokenStore.setRefreshToken(token))
              .then(() => {
                this._enterApp();
              });
            }
          });
        } else {
          console.log('token store still has refresh');
          this._tokenStoreRefreshTokenIsValid(valid => {
            if (!valid) {
              this._cleanupUser();
              this._navigateToEntrance();
            } else {
              // refresh token still valid
              console.log('token stored refresh is still valid');
              this._enterApp();
            }
          });
        }
      }
    });
  }

  _checkNavigation = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;

    // Check which page the app should be on
    console.log("Checking user status");

    // try setting token from secure storage
    if (!tokenStore.refreshToken) {
      this._secureStoreRefreshTokenIsValid((valid, refreshToken) => {
        if (!valid) {
          console.log('secure store token is invalid');
          this._cleanupUser();
          this.setState({ loaded: true });
          return;
        } else {
          console.log('secure store token is valid');
          console.log('token: ' + refreshToken);
          tokenStore.setRefreshToken(refreshToken);
          // fetch new access token
          postTokenRequest(refreshToken)
          .then(response => {
            if (!response.ok) { throw response }
            return response.json();
          })
          .then(responseData => {
            const token = responseData['access_token'];
            const user = responseData['user'];
            tokenStore.setAccessToken(token);
            storeAccessToken(token);
            userStore.setUser(user);
            storeUser(user);
            return user;
          })
          .then(user => {
            // check user status
            if (user === null || user === undefined || userStore.disabled) {
              console.log('fetching user failed');
              return;
            }
            // get user profile
            getUserProfile(tokenStore.accessToken)
            .then(response => {
              if (!response.ok) { throw response }
              return response.json();
            })
            .then(responseData => {
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
            .catch(() => {
              console.log('error fetching user profile');
            });

            // user has made it through the gauntlet
            // decide where they'll go
            this.setState({ loaded: true });
            if (!user.active) {
              console.log('user is not activated');
              this.props.navigation.navigate('Verification');          
            } else {
              this.props.navigation.navigate('Main');          
            }
          })
        }
      })
    } else {
      // is set, check that it's valid
      this._tokenStoreRefreshTokenIsValid(valid => {
        if (!valid) {
          console.log('token store token is not valid');
          this._cleanupUser();
          tokenStore.setRefreshToken('');
          this.setState({ loaded: true });
          return;
        }
      })
    }

    // if still not available & valid, stop
    if (!tokenStore.refreshToken) {
      console.log('no refresh token is available');
      this._cleanupUser();
      this.setState({ loaded: true });
      return;
    }
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View style={styles.view}>
          <ImageBackground source={images.enter} style={styles.backgroundImage} />
        </View>
      );
    } else {
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
