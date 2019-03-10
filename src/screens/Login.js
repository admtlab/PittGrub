import { checkGated, login } from '../api/auth';
import { registerForNotifications, setExpoPushToken } from '../api/notification';
import { BackButton, PrimaryButton } from '../components/Button';
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


@inject('featureStore', 'tokenStore', 'userStore')
export default class Login extends PureComponent {
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

  submit = () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    login(this.state.email, this.state.password, this.props.tokenStore, this.props.userStore)
    .then(this.props.userStore.loadUserProfile)
    .then(() => {
      if (this.props.userStore.account.active) {
        // continue to main if user account is active
        this.props.navigation.navigate('Main')
      } else {
        this.props.tokenStore.getOrFetchAccessToken()
        .then(checkGated)
        .then(gated => gated ? this.setState({ enableGate: true }) : this.props.navigation.navigate('Verification'));
      }
    })
    .then(() => {
      if (!this.props.featureStore.features.notifications) {
        registerForNotifications()
        .then(granted => {
          this.props.featureStore.setFeatures({ notifications: granted });
          if (granted) {
            this.props.tokenStore.getOrFetchAccessToken().then(setExpoPushToken);
          }
        })
      }
    })
    .catch(this.handleError)
    .finally(() => this.setState({ loading: false }));
  }

  handleError = (err) => {
    Alert.alert(
      'Error',
      err.status === 401 ? 'Incorrect username or password' : 'An error occurred, please try again later',
      { text: 'OK' }
    );
  }

  passwordResetScreen = () => {
    this.props.navigation.navigate('PasswordReset');
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this.goBack} />;
    }

    const enableSubmit = isEmail(this.state.email) && this.state.password.length > 0;

    return (
      <EntryForm>
        <EmailInput value={this.state.email} onChangeText={this.setEmail} submit={this.passwordInputFocus} />
        <PasswordInput ref='passwordInput' value={this.state.password} onChangeText={this.setPassword} submit={this.submit} />
        <View height={142}>
          {this.state.loading ? <ActivityIndicator size='large' color='#222' marginTop={50} /> : (
            <Fragment>
              <PrimaryButton text='LOG IN' onPress={this.submit} disabled={!enableSubmit} />
              <BackButton onPress={this.goBack} />
            </Fragment>
          )}
        </View>
        <View style={styles.footer}>
          <Text onPress={this.passwordResetScreen} style={styles.footerText}>
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
  footerText: {
    alignSelf: 'center',
    fontSize: width / 24,
    color: colors.softGrey,
  }
});
