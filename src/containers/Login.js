/* @flow */

import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, BackButton } from '../components/Button';
import Logo from '../components/Logo';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { postLogin } from '../lib/api';
import { storeToken, storeUser } from '../lib/auth';
import { registerForPushNotifications } from '../lib/notifications';


// screen dimensions
var { width, height } = Dimensions.get('window');
const top = height * 0.25;

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
      correctCredentials: false,
    };
    this.logoSize = new Animated.Value(width / 4);
    this.logoSizeLarge = width / 4;
    this.logoSizeSmall = width / 6;

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

    console.log(height);
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
          toValue: this.logoSizeSmall,
        }).start();
      }
    }
  }

  _keyboardWillHide = (event) => {
    this.refs.scrollView.scrollTo({ y: 0, animated: true });
    if (height < 600) {
      Animated.timing(this.logoSize, {
        duration: event.duration,
        toValue: this.logoSizeLarge,
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

  _login = async () => {
    // check that credentials are filled
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
            activated = responseData['user']['active'];
            status = responseData['user']['status'];
            storeToken({ token: responseData['token'], expires: responseData['expires'] });
            storeUser(responseData['user']);
            global.admin = responseData['user']['admin'];
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
        /* paddingTop={height - 550} */
        paddingTop={top}
        /* paddingBottom={-height + 550} */
        style={styles.container}>
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
            /* returnKeyType="next" */
            returnKeyType="none"
            autoCapitalize='none'
            blurOnSubmit={true}
            autoCorrect={false}
            keyboardType={'email-address'}
            onChangeText={(text) => this.setState({ 'email': text })}
            /* onSubmitEditing={(event) => {
              this.refs.PasswordInput.focus();
              this.refs.scrollView.scrollTo({ y: 0, animated: false });
            }} */
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
          <Text style={{marginLeft: -width + 200, fontSize: width/22, color: colors.softGrey}} onPress={() => console.log('forgot')}>Forgot your password?</Text>
          {!this.state.loading &&
            <View>
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
          <View style={{ height: 120 }} />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };
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
    fontSize: width / 20,
    width: width,
    height: 40,
    marginBottom: 10,
    color: colors.softGrey,
    backgroundColor: colors.transparentTextEntry,
    alignItems: 'center',
    textAlign: 'center',
  },
});
