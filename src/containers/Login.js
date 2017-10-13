/* @flow */

import React from 'react';
import { ActivityIndicator, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, BackButton } from '../components/Button';
import Logo from '../components/Logo';
import { colors } from '../config/styles';
import { postLogin } from '../lib/api';
import { storeToken, storeUser } from '../lib/auth';
import { registerForPushNotifications } from '../lib/notifications';


// screen dimensions
var { width, height } = Dimensions.get('window');


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
      correctCredentials: false,
    }

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._login = this._login.bind(this);
  }

  componentWillMount() {
    // move login form out of the way when
    // keyboard is coming into view
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);

    // put them back
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardWillShow = () => {
    if (!this.state.loading)
      this.refs.scrollView.scrollTo({ y: 50, animated: true });
  }

  _keyboardWillHide = () => {
    this.refs.scrollView.scrollTo({ y: 0, animated: true });
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
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status !== undefined && responseData.status >= 400) {
            console.log('printing message')
            const message = responseData['message'];
            console.log(message);
          } else {
            console.log(responseData);
            this.setState({ loading: false });
            activated = responseData['user']['active'];
            status = responseData['user']['status'];
            console.log('storing token');
            storeToken({ token: responseData['token'], expires: responseData['expires'] });
            console.log('storing user');
            storeUser(responseData['user']);
            console.log('setting global');
            global.admin = responseData['user']['admin'];
            registerForPushNotifications();
            if (!activated) {
              console.log('not activated');
              this._clearState();
              this.props.navigation.navigate('Verification');
            } else if (status !== "ACCEPTED") {
              console.log('near waiting');
              this.props.navigation.navigate('Waiting');
            } else {
              this.props.navigation.navigate('Home');
            }
          }
        })
        .catch((error) => {
          console.log('error loggin ing');
          console.log(error);
        })
        .done(() => {
          this.setState({ loading: false });
        });
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <ScrollView
        ref='scrollView'
        scrollEnabled={false}
        keyboardShouldPersistTaps={'never'}
        paddingTop={height - 550} paddingBottom={-height + 550}
        style={styles.container}>
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.view}>
          <Logo size={width / 4} />
          <TextInput
            ref="EmailInput"
            style={styles.input}
            marginTop={20}
            placeholder="Email address"
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 36 }}
            returnKeyType="next"
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
            /* marginLeft={60} */
            placeholder="Password"
            secureTextEntry
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 20 }}
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
          {!this.state.loading &&
            <View>
              <Button text="ENTER"
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
