import { signup } from '../api/auth';
import { BackButton, Button } from '../components/Button';
import { EmailInput, PasswordInput } from '../components/Input';
import { EntryForm } from '../components/Form';
import { inject } from 'mobx-react';
import { ActivityIndicator, Alert, Keyboard, View } from 'react-native';
import Gate from '../components/Gate';
import React, { Fragment, PureComponent } from 'react';
import isEmail from 'validator/lib/isEmail';


@inject('tokenStore', 'userStore')
export default class Signup extends PureComponent {
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
    signup(this.state.email, this.state.password, this.props.tokenStore, this.props.userStore)
    .then(this.props.userStore.loadUserProfile)
    .then(() => {
      if (this.props.userStore.account.active) {
        // continue if user account is active
        this.props.navigation.navigate('Home')
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
      err.status === 400 ? 'Invalid email address.' : 'An error occurred, please try again later.',
      { text: 'OK' }
    );
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this._goBack} />;
    }

    const enableSubmit = isEmail(this.state.email) && this.state.password.length > 0;

    return (
      <EntryForm>
        <EmailInput
          placeholder='Pitt Email Address'
          value={this.state.email}
          onChangeText={this._setEmail}
          submit={this._passwordInputFocus}
        />
        <PasswordInput
          ref='passwordInput'
          placeholder='Choose a Secure Password'
          value={this.state.password}
          onChangeText={this._setPassword}
          submit={this._submit}
        />
        <View height={142}>
          {this.state.loading ? <ActivityIndicator color='#fff' size='large' marginTop={50} /> : (
            <Fragment>
              <Button text='CREATE ACCOUNT' onPress={this._submit} disabled={!enableSubmit} />
              <BackButton onPress={this._goBack} />
            </Fragment>
          )}
        </View>
      </EntryForm>
    );
  }
}
