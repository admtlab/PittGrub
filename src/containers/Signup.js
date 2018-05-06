/* @flow */

import { inject, observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, BackButton } from '../components/Button';
import Logo from '../components/Logo';
import metrics from '../config/metrics';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { postSignup } from '../lib/api';
import { storeAccessToken, storeRefreshToken } from '../lib/token';
import { storeUser } from '../lib/user';
import { registerForPushNotifications } from '../lib/notifications';


// screen dimensions
var { width, height } = Dimensions.get('window');
const top = height * 0.25;


@inject("tokenStore", "userStore")
@observer
export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
    };

    this.logoSize = new Animated.Value(metrics.logoSizeLarge);

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._signup = this._signup.bind(this);
  }

  componentDidMount() {
    // move signup form out of the way when
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

  _signup = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    const email = this.state.email.trim();
    const password = this.state.password;

    // only submit if credentials are filled in
    // and email is a pitt email address
    if (email !== '' && password !== '') {
      if (!email.toLowerCase().endsWith('@pitt.edu')) {
        Alert.alert('Error', 'A Pitt email address is required', {test: 'OK'});
        this._clearState();
      } else {
        postSignup(email, password)
        .then(response => {
          if (!response.ok) throw { response };
          return response.json();
        })
        .then(responseData => {
          const refreshToken = responseData['refresh_token'];
          const accessToken = responseData['access_token'];
          const user = responseData['user'];
          tokenStore.setRefreshToken(refreshToken);
          tokenStore.setAccessToken(accessToken);
          userStore.setUser(user);
          storeRefreshToken(refreshToken);
          storeAccessToken(accessToken);
          storeUser(user);

          // get user profile
          userStore.setProfile({
            foodPreferences: [],
            pantry: false,
          });
          // user has to verify their email
          this._clearState();
          this.props.navigation.navigate('Verification');
        })
        .catch((error) => {
          if (!error.response) {
            Alert.alert('Error', 'Something went wrong', {text: 'OK'});
          } else {
            const body = JSON.parse(error.response['_bodyText']);
            const msg = body.message;
            Alert.alert('Error', msg, {text: 'OK'});
          }
        })
        .done(() => this.setState({ loading: false }));
      }
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
        style={styles.container}>
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.view}>
          <Logo size={this.logoSize} />
          <TextInput
            ref="EmailInput"
            style={styles.input}
            marginTop={5}
            placeholder="Pitt Email Address"
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 20 }}
            returnKeyType="next"
            autoCapitalize='none'
            blurOnSubmit={true}
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
            placeholder="Pick a Secure Password"
            placeholderTextColor='#444'
            secureTextEntry
            returnKeyType="send"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => this.setState({ 'password': text })}
            onSubmitEditing={(event) => {
              Keyboard.dismiss();
              this.setState({ loading: true });
              this._signup();
              this.setState({ loading: false });
            }}
            value={this.state.password} />
          {!this.state.loading &&
            <View>
              <Button text="ENTER"
                disabled={!isEnabled}
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ loading: true });
                  this._signup();
                  this.setState({ loading: false });
                }}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
              <BackButton
                onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack(null) }}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
            </View>}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
