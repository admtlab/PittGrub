/* @flow */

import React from 'react';
import { Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { BackButton, ButtonIconRight } from '../components/Button';
import Logo from '../components/Logo';
import metrics from '../config/metrics';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { postPasswordReset } from '../lib/api';


// screen dimensions
var { width, height } = Dimensions.get('window');
const top = height * 0.25;


export default class PasswordResetScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      buttonText: 'SEND',
      requestSent: false,
      email: ''
    };

    this.logoSize = new Animated.Value(metrics.logoSizeLarge);
    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._resetPasswordRequest = this._resetPasswordRequest.bind(this);
  }

  componentDidMount() {
    // move verification form when
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

  _resetPasswordRequest = async () => {
    const email = this.state.email.trim();
    postPasswordReset(email)
    .then(response => {
      if (!response.ok) { throw response }
      this.setState({ requestSent: true });
      this.setState({ buttonText: "CHECK YOUR EMAIL" });
    })
    .catch(error => {
      const body = JSON.parse(error['_bodyText']);
      const msg = body.message;
      if (msg) {
        Alert.alert('Error', msg, {text: 'OK'});
      } else {
        Alert.alert('Error', 'Something went wrong', {text: 'OK'});          
      }
    })
    .done(_ => this.setState({ loading: false }));
  }

  render() {
    const isDisabled = this.state.email.trim().length === 0 || this.state.requestSent;
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
            ref="ResetEmail"
            style={styles.input}
            inputStyle={{ fontSize: 20 }}
            marginTop={5}
            placeholder="Email"
            placeholderTextColor='#444'
            autoCapitalize="none"
            returnKeyType="send"
            onChangeText={(text) => this.setState({ email: text })}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              this.setState({ loading: true });
              this._resetPasswordRequest();
            }}
            value={this.state.email} />
            <View>
              <ButtonIconRight text={this.state.buttonText}
                icon="mail"
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ loading: true });
                  this._resetPasswordRequest();
                }}
                disabled={isDisabled}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
              <BackButton
                onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack(null) }}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
            </View>
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
