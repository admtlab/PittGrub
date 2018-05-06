/* @flow */

import { inject, observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Button, ButtonIconRight } from '../components/Button';
import Logo from '../components/Logo';
import metrics from '../config/metrics';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { getVerification, postVerification } from '../lib/api';
import { getUser, activateUser } from '../lib/user';
import { registerForPushNotifications } from '../';


// screen dimensions
var { width, height } = Dimensions.get('window');
const top = height * 0.25;

@inject("tokenStore", "userStore")
@observer
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
    this._resendVerifiction = this._resendVerifiction.bind(this);
  }

  componentDidMount() {
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

  _resendVerifiction = async () => {
    const tokenStore = this.props.tokenStore;
    const accessToken = await tokenStore.getOrFetchAccessToken();
    getVerification(accessToken)
      .then(() => {
        this.setState({ verificationResent: true });
        this.setState({ resendText: "CHECK YOUR EMAIL" });
      })
      .catch(error => console.log(error));
  }

  _verification = async () => {
    const tokenStore = this.props.tokenStore;
    const accessToken = await tokenStore.getOrFetchAccessToken();
    const code = this.state.code;
    postVerification(accessToken, code)
    .then(response => {
      if (!response.ok) { throw response };
      activateUser();
      this._clearState();
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: 'Main'})
        ]
      }));
    })
    .catch(error => {
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
                onPress={() => this._resendVerifiction()}
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
