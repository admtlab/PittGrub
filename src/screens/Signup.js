import { checkGated, signup } from '../api/auth';
import { BackButton, Button } from '../components/Button';
import { EmailInput, PasswordInput } from '../components/Input';
import { EntryForm } from '../components/Form';
import { colors } from '../config/styles';
import { inject } from 'mobx-react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Gate from '../components/Gate';
import React, { Fragment, PureComponent } from 'react';
import isEmail from 'validator/lib/isEmail';


const { width, height } = Dimensions.get('window');
const footer = height - 230;


@inject('tokenStore', 'userStore')
export default class Signup extends PureComponent {
  state = {
    loading: false,
    email: '',
    password: '',
    enableGate: false
  };

  goBack = () => this.props.navigation.goBack();

  passwordInputFocus = () => this.refs.passwordInput.focus();

  setEmail = (email) => this.setState({ email });

  setPassword = (password) => this.setState({ password });

  hostSignupScreen = () => this.props.navigation.navigate('HostSignup');

  submit = () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    signup(this.state.email, this.state.password, this.props.tokenStore, this.props.userStore)
    .then(this.props.userStore.loadUserProfile)
    .then(() => {
      if (this.props.userStore.account.active) {
        // continue if user account is active
        this.props.navigation.navigate('Home')
      } else {
        this.props.tokenStore.getOrFetchAccessToken()
        .then(checkGated)
        .then(gated => gated ? this.setState({ enableGate: true }) : this.props.navigation.navigate('Verification'));
      }
    })
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  _handleError = (err) => {
    Alert.alert(
      'Error',
      err.status === 400 ? 'Invalid email address.' : 'An error occurred, please try again later.',
      { text: 'OK' }
    );
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this.goBack} />;
    }

    const enableSubmit = isEmail(this.state.email) && this.state.password.length > 0;

    return (
      <EntryForm>
        <EmailInput
          placeholder='Pitt Email Address'
          value={this.state.email}
          onChangeText={this.setEmail}
          submit={this.passwordInputFocus}
        />
        <PasswordInput
          ref='passwordInput'
          placeholder='Choose a Secure Password'
          value={this.state.password}
          onChangeText={this.setPassword}
          submit={this.submit}
        />
        <View height={142}>
          {this.state.loading ? <ActivityIndicator color='#fff' size='large' marginTop={50} /> : (
            <Fragment>
              <Button text='CREATE ACCOUNT' onPress={this.submit} disabled={!enableSubmit} />
              <BackButton onPress={this.goBack} />
            </Fragment>
          )}
        </View>
        <View style={styles.footer}>
          <Text onPress={this.hostSignupScreen} style={styles.footerText}>
            Want to become a host?
          </Text>
        </View>
      </EntryForm>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    alignItems: 'center',
    top: footer,
  },footerText: {
    alignSelf: 'center',
    fontSize: width / 24,
    color: colors.softGrey,
  },
})
