/* @flow */

import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, BackButton } from '../components/Button';
import { inject, observer } from 'mobx-react';
import Logo from '../components/Logo';
import metrics from '../config/metrics';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { postLogin, getUserProfile } from '../lib/api';
import { storeToken, storeUser } from '../lib/auth';
import { isHost, getProfile, storeProfile } from '../lib/user';
import { registerForPushNotifications } from '../lib/notifications';


// screen dimensions
var { width, height } = Dimensions.get('window');
const top = height * 0.25;

@inject("tokenStore")
@observer
export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
      correctCredentials: false,
    };
    this.logoSize = new Animated.Value(metrics.logoSizeLarge);

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._login = this._login.bind(this);
  }

  componentWillMount() {
    // move login form out of the way when
    // keyboard is coming into view
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);

    // put it back
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount() {
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
    });
  }

  _checkPermissions = async () => {

  }

  _login = async () => {
    // check that credentials are filled
    const tokenStore = this.props.tokenStore;
    if (this.state.email !== '' && this.state.password !== '') {
      let activated = false;
      let status = '';
      postLogin(this.state.email, this.state.password)
        .then(response => response.json())
        .then(responseData => {
          if (responseData['status'] && responseData['status'] >= 400) {
            // request was an error
            if (responseData['message'] && responseData['message'].startsWith('Incorrect username or password')) {
              Alert.alert('Error', 'Incorrect username or password', {text: 'OK'});
            } else if (responseData.message) {
              Alert.alert('Error', responseData.message, {text: 'OK'});
            } else {
              Alert.alert('Error', 'Something went wrong', {text: 'OK'});
            }
          } else {
            this.setState({ loading: false });
            user = responseData['user'];
            token = responseData['token'];
            activated = user.active;
            status = user.status;
            storeToken({ token: token, expires: responseData['expires'] });
            storeUser(user);
            console.log('setting access token');
            console.log(token);
            tokenStore.setAccessToken(token);
            tokenStore.id = user.id;
            tokenStore.email = user.email;
            tokenStore.name = user.name;
            tokenStore.status = user.status;
            tokenStore.roles = user.roles;
            tokenStore.active = user.active;
            tokenStore.disabled = user.disabled;
            getProfile()
            .then(response => response.json())
            .then(responseData => {
              profile = {
                id: responseData['id'],
                pittPantry: responseData['pitt_pantry'],
                eagerness: responseData['eagerness'],
                foodPreferences: responseData['food_preferences']
              };
              storeProfile(profile);
            });
            global.admin = isHost(user);
            registerForPushNotifications();
            this._clearState();
            if (!activated) {
              console.log("Not activated, sending to verification screen");
              this.props.navigation.navigate('Verification');
            } else if (settings.requireApproval && status !== "ACCEPTED") {
              console.log("approval required, sending to waiting screen");
              this.props.navigation.navigate('Waiting');
            } else {
              console.log("they're good, sending to main page");
              this.props.navigation.navigate('Main');
            }
          }
        })
        .catch((error) => {
          Alert.alert('Error', 'Something went wrong', {text: 'OK'});
          console.log('ERROR: Failed to log in');
          console.log(error);
        })
        .done(() => {
          this.setState({ loading: false });
        });
    }
  }

  render() {
    const isEnabled = this.state.email.length > 0 &&
      this.state.password.length > 0;
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
          <TextInput
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
            value={this.state.email} />
          <TextInput
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
              this.setState({ loading: false });
            }}
            value={this.state.password} />
          </KeyboardAvoidingView>
          <View style={styles.forgotPasswordView}>
            <Text style={styles.forgotPassword}
              onPress={() => this.props.navigation.navigate('PasswordReset')}>
              Forgot your password?
            </Text>
          </View>
          <KeyboardAvoidingView
            behavior='padding'
            style={styles.view}>
          {!this.state.loading &&
            <View justifyContent='space-between' alignItems='center'>
              <Button text="ENTER"
                disabled={!(isEnabled)}
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ loading: true });
                  this._login();
                  this.setState({ loading: false });
                }}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
              <BackButton
                onPress={() => this.props.navigation.goBack(null)}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
            </View>}
          {this.state.loading &&
            <ActivityIndicator
              color='#fff' />}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.softBlue,
    height: height,
    width: width,
  },
  view: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    width: width - 100,
    height: 40,
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
