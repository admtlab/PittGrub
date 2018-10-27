/* @flow */

import { inject, observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, BackButton } from '../components/Button';
import Logo from '../components/Logo';
import metrics from '../config/metrics';
import { colors } from '../config/styles';
import { getVerification, postLogin, getUserProfile } from '../lib/api';
// import { registerForPushNotifications } from '../lib/notifications';
import { storeAccessToken, storeRefreshToken, getRefreshToken } from '../lib/token';
import { storeProfile, storeUser } from '../lib/user';


// screen dimensions
const { width, height } = Dimensions.get('window');
const top = height * 0.25;


@inject("tokenStore", "userStore")
@observer
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
      correctCredentials: false,
      enableGate: false
    };

    this.logoSize = new Animated.Value(metrics.logoSizeLarge);
    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._login = this._login.bind(this);
  }
  
  componentDidMount() {
    // move login form and logo when
    // keyboard is coming into view
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    // put them back when keyboard is leaving
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount() {
    // remove listeners when component is done
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardWillShow = (event) => {
    const space = event.endCoordinates.height * 0.6;
    if (!this.state.loading) {
      this.refs.scrollView.scrollTo({ y: space, animated: true });
      if (height < 600) {
        Animated.timing(this.logoSize, {
          duration: event.duration,
          toValue: metrics.logoSizeSmall,
        }).start();
      }
    }
  }

  _keyboardWillHide = (event) => {
    this.refs.scrollView.scrollTo({ y: 0, animated: true });
    if (height < 600) {
      Animated.timing(this.logoSize, {
        duration: event.duration,
        toValue: metrics.logoSizeLarge,
      }).start();
    }
  }

  _clearState = async () => {
    this.setState({
      email: '',
      password: '',
      loading: false,
      correctCredentials: false,
      enableGate: false
    });
  }

  _login = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    const email = this.state.email.trim();
    const password = this.state.password;

    // check that credentials are filled
    if (email !== '' && password !== '') {
      postLogin(email, password)
      .then(response => {
        if (!response.ok) throw { response };
        return response.json();
      })
      .then(responseData => {
        // store tokens and user data
        const refreshToken = responseData['refresh_token'];
        const accessToken = responseData['access_token'];
        const user = responseData['user'];
        tokenStore.setRefreshToken(refreshToken);
        tokenStore.setAccessToken(accessToken);
        userStore.setUser(user);
        storeRefreshToken(refreshToken)
        storeAccessToken(accessToken);
        storeUser(user);

        // get user profile
        getUserProfile(accessToken)
        .then((response) => {
          if (!response.ok) { throw response.json() };
          return response.json();
        })
        .then((responseData) => {
          const profile = {
            foodPreferences: responseData['food_preferences'].map(fp => fp.id),
            pantry: responseData['pitt_pantry']
          };
          userStore.setProfile(profile);
          storeProfile(profile);
        })
        
        // go to next screen
        this._clearState();
        if (user.active) {
          this.props.navigation.navigate('Main');
        } else {
          getVerification(accessToken).then(response => {
            if (!response.ok) {
              console.log(response);
              this.setState({ enableGate: true });
            } else {
              this.props.navigation.navigate('Verification');
            }
          })
        }
      })
      .catch(error => {
        if (!error.response) {
          // no response object (other error)
          Alert.alert('Error', 'Something went wrong', {text: 'OK'});
        } else {
          console.log('printing error');
          console.log(error);
          const body = JSON.parse(error.response['_bodyText']);
          const msg = body.message;
          if (msg && msg.startsWith('Error: Incorrect')) {
            Alert.alert('Error', 'Incorrect username or password', {text: 'OK'});
          } else if (msg) {
            Alert.alert('Error', msg, {text: 'OK'});
          } else {
            Alert.alert('Error', 'Something went wrong', {text: 'OK'});
          }
        }
      })
      .done(() => this.setState({ loading: false }));
    }
  }

  render() {
    const email = this.state.email.trim();
    const password = this.state.password;
    const isEnabled = email.length > 0 && password.length > 0;
    return (
      <ScrollView
        ref='scrollView'
        scrollEnabled={false}
        keyboardShouldPersistTaps={'handled'}
        paddingTop={top}
        style={styles.scrollContainer}>
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.view}>
          <Logo size={this.logoSize} />
          {this.state.enableGate && <Text style={styles.gateText}>Thanks for siging up for PittGrub! We will notify you once your account has been approved.</Text>}
          {!this.state.enableGate && <TextInput
            ref="EmailInput"
            style={styles.input}
            marginTop={5}
            placeholder="Email Address"
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 36 }}
            returnKeyType="next"
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType={'email-address'}
            onChangeText={(text) => this.setState({ 'email': text })}
            onSubmitEditing={(event) => {
              this.refs.PasswordInput.focus();
            }}
            value={this.state.email} />}
          {!this.state.enableGate && <TextInput
            ref="PasswordInput"
            style={styles.input}
            inputStyle={{ fontSize: 20 }}
            placeholder="Password"
            placeholderTextColor='#444'
            secureTextEntry
            returnKeyType="send"
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={(text) => this.setState({ 'password': text })}
            onSubmitEditing={(event) => {
              Keyboard.dismiss();
              this.setState({ loading: true });
              this._login();
            }}
            value={this.state.password} />}
          </KeyboardAvoidingView>
          {!this.state.enableGate && <View style={styles.forgotPasswordView}>
            <Text style={styles.forgotPassword}
              onPress={() => this.props.navigation.navigate('PasswordReset')}>
              Forgot your password?
            </Text>
          </View>}
          <KeyboardAvoidingView
            behavior='padding'
            style={styles.view}>
          {!this.state.loading &&
            <View justifyContent='space-between' alignItems='center'>
              {!this.state.enableGate && <Button text="ENTER"
                disabled={!(isEnabled)}
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ loading: true });
                  this._login();
                }}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />}
              <BackButton
                onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack(null) }}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
            </View>}
          {this.state.loading &&
            <ActivityIndicator color='#fff' />}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: width,
    height: height,
    backgroundColor: colors.softBlue,
  },
  view: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    width: width - 100,
    height: 40,
    marginTop: 20,
  },
  buttonText: {
    fontSize: width / 20,
  },
  forgotPasswordView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  forgotPassword: {
    fontSize: width / 22,
    fontStyle: 'italic',
    color: colors.softGrey
  },
  gateText: {
    fontSize: width / 18,
    color: colors.softGrey,
    marginLeft: 10,
    marginRight: 10
  },
  input: {
    borderRadius: 1,
    fontSize: width / 20,
    width: width - 40,
    height: 40,
    marginBottom: 10,
    color: colors.softGrey,
    backgroundColor: colors.transparentTextEntry,
    alignItems: 'center',
    textAlign: 'center',
  },
});
