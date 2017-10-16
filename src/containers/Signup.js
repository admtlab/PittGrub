import React from 'react';
import { ActivityIndicator, Alert, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, BackButton } from '../components/Button';
import Logo from '../components/Logo';
import settings from '../config/settings';
import { colors } from '../config/styles';
import { postSignup, postLogin } from '../lib/api';
import { getToken, storeUser, storeToken } from '../lib/auth';
import { registerForPushNotifications } from '../lib/notifications';


// screen dimensions
var { width, height } = Dimensions.get('window');


export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      incorrectPassword: false,
      alreadyExists: false,
      loading: false,
    };

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._signup = this._signup.bind(this);
  }

  componentWillMount() {
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

  _keyboardWillShow = () => {
    if (!this.state.loading) {
      this.refs.scrollView.scrollTo({ y: 80, animated: true });
    }
  }

  _keyboardWillHide = () => {
    this.refs.scrollView.scrollTo({ y: 0, animated: true });
  }

  _clearState = async () => {
    this.setState({
      email: '',
      password: '',
      loading: false,
      alreadyExists: false,
    });
  }

  _signup = async () => {
    // only submit if credentials are filled in
    if (this.state.email !== '' && this.state.password !== '') {
      let activated = false;
      let accepted = false;
      let status = '';
      postSignup(this.state.email, this.state.password)
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData['status'] && responseData['status'] >= 400) {
            // alert user of error
            let message = 'Something went wrong';
            if (responseData.message && responseData.message.startsWith('Error: user already exists')) {
              this.setState({ alreadyExists: true });
              message = 'User already exists with that email address';
            }
            Alert.alert('Error', message, {text: 'OK'});
          } else {
            // response was ok
            this.setState({ alreadyExists: false });
            global.admin = responseData.user.admin
            storeUser(responseData.user)
            storeToken({ token: responseData.token, expires: responseData.expires });
            this._clearState();
            // user has to verify their email
            this.props.navigation.navigate('Verification');
          }
        })
        .catch((error) => {
          console.log("Error signing up");
          console.log(error);
          Alert.alert('Error', 'Something went wrong', {text: 'OK'});
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
        keyboardShouldPersistTaps={'never'}
        paddingTop={height - 550}
        paddingBottom={-height + 550}
        style={styles.container}>
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.view}>
          <Logo size={width / 4} />
          <TextInput
            ref="EmailInput"
            style={styles.input}
            marginTop={20}
            placeholder="Pitt Email Address"
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 20 }}
            returnKeyType='none'
            autoCapitalize='none'
            blurOnSubmit={true}
            autoCorrect={false}
            keyboardType={'email-address'}
            onChangeText={(text) => this.setState({ 'email': text })}
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
                onPress={() => this.props.navigation.goBack(null)}
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
