import { login } from '../api/auth';
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
  View
} from 'react-native';
import Gate  from '../components/Gate';
import React, { Fragment, PureComponent } from 'react';
import isEmail from 'validator/lib/isEmail';


const { width, height } = Dimensions.get('window');
const footer = height - 230;


@inject('tokenStore', 'userStore')
export default class Login extends PureComponent {
  state = {
    loading: false,
    email: '',
    password: '',
    enableGate: false
  };

  _goBack = () => {
    this.props.navigation.goBack();
  }

  _passwordInputFocus = () => {
    this.refs.passwordInput.focus();
  }

  _setEmail = (email) => {
    this.setState({ email });
  }

  _setPassword = (password) => {
    this.setState({ password });
  }

  _submit = () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    login(this.state.email, this.state.password, this.props.tokenStore, this.props.userStore)
    .then(this.props.userStore.loadUserProfile)
    .then(() => {
      if (this.props.userStore.account.active) {
        // continue to verification if user account is active
        console.log('navigate to main');
        this.props.navigation.navigate('Main')
      } else {
        // show gate if not
        this.setState({ enableGate: true });
      }
    })
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  _handleError = (err) => {
    Alert.alert(
      'Error',
      err.status === 401 ? 'Incorrect username or password' : 'An error occurred, please try again later',
      { text: 'OK' }
    );
  }

  _passwordResetScreen = () => {
    this.props.navigation.navigate('PasswordReset');
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this._goBack} />;
    }

    const enableSubmit = isEmail(this.state.email) && this.state.password.length > 0;

    return (
      <EntryForm>
        <EmailInput value={this.state.email} onChangeText={this._setEmail} submit={this._passwordInputFocus} />
        <PasswordInput ref='passwordInput' value={this.state.password} onChangeText={this._setPassword} submit={this._submit} />
        <View height={142}>
          {this.state.loading ? <ActivityIndicator size='large' color='#fff' marginTop={50} /> : (
            <Fragment>
              <Button text='LOG IN' onPress={this._submit} disabled={!enableSubmit} />
              <BackButton onPress={this._goBack} />
            </Fragment>
          )}
        </View>
        <View style={styles.footer}>
          <Text onPress={this._passwordResetScreen} style={styles.forgotPassword}>
            Forgot your password?
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
  },
  forgotPassword: {
    alignSelf: 'center',
    fontSize: width / 24,
    color: colors.softGrey,
  }
});
