/* @flow */

import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Button, ButtonIconRight } from '../components/Button';
import Logo from '../components/Logo';
import metrics from '../config/metrics';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { getVerification, postVerification } from '../lib/api';
import { getUser, activateUser } from '../lib/auth';
import { registerForPushNotifications } from '../';


// screen dimensions
var { width, height } = Dimensions.get('window');
const top = height * 0.25;


export default class VerificationScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      resendText: 'RESEND',
      verificationResent: false,
      code: ''
    };

    this.logoSize = new Animated.Value(metrics.logoSizeLarge);

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._verification = this._verification.bind(this);
  }

  componentWillMount() {
    // move verification form out of the way when
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
    const space = event.endCoordinates.height * 0.5;
    if (!this.state.loading) {
      this.refs.scrollView.scrollTo({ y: space, animated: true });
      if (height < 600) {
        Animated.timing(this.logoSize, {
          duration: event.duration,
          toValue: metrics.logoSizeSmall
        }).start();
      }
    }
  }

  _keyboardWillHide = (event) => {
    this.refs.scrollView.scrollTo({ y: 0, animated: true });
    if (height < 600) {
      Animated.timing(this.logoSize, {
        duration: event.duration,
        toValue: metrics.logoSizeLarge
      }).start();
    }
  }

  _clearState = async () => {
    this.setState({
      code: '',
      loading: false,
    });
  }

  _verification = async () => {
    console.log('Sending verification code: ' + this.state.code);
    postVerification(this.state.code)
      .then((response) => {
        if (response.ok) {
          console.log('response is ok');
          let status = '';
          activateUser();
          console.log('user activated');
          registerForPushNotifications();
          console.log('push notification registered');
          getUser()
            .then((user) => {
              console.log('got user');
              console.log(user);
              status = user.status;
              this.setState({ loading: false });
              if (settings.requireApproval && status !== 'ACCEPTED') {
                console.log('Requires approval, go to waiting screen');
                this.props.navigation.navigate('Waiting');
              } else {
                console.log('Go to Main screen');
                this.props.navigation.dispatch(NavigationActions.reset({
                  index: 0,
                  key: null,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Main' })
                  ],
                }));
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.setState({ loading: false });
          response.json()
            .then((responseData) => {
              if (responseData['message'] && responseData['message'].startsWith('Invalid activation')) {
                Alert.alert('Error', 'Invalid verification code', { text: 'OK' });
              } else {
                Alert.alert('Error', 'Something went wrong', { text: 'OK' });
              }
            });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('failed activation');
      });
  }

  render() {
    const isEnabled = (this.state.code.length == 6);
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
            ref="VerificationCode"
            style={styles.input}
            marginTop={5}
            placeholder="Verification Code"
            maxLength={6}
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 20 }}
            autoCapitalize="characters"
            returnKeyType="send"
            clearButtonMode="always"
            onChangeText={(text) => this.setState({ code: text.toUpperCase() })}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              this.setState({ loading: true });
              this._verification();
            }}
            value={this.state.code} />
          {!this.state.loading &&
            <View>
              <Button text="ENTER"
                onPress={() => {
                  Keyboard.dismiss()
                  this.setState({ loading: true });
                  this._verification();
                }}
                disabled={!isEnabled}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
              <ButtonIconRight text={this.state.resendText}
                icon="mail"
                onPress={() => {
                  getVerification()
                    .then(() => {
                      this.setState({ verificationResent: true });
                      this.setState({ resendText: "CHECK YOUR EMAIL" });
                    });
                }}
                disabled={this.state.verificationResent}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
            </View>}
          {this.state.loading && <ActivityIndicator color='#fff' />}
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
