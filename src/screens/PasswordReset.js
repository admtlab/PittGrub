import React, { ActivityIndicator, Fragment, PureComponent } from 'react';
import { Keyboard, View } from 'react-native';
import isEmail from 'validator/lib/isEmail';
import { BackButton, ButtonIconRight } from '../components/Button';
import { EntryForm } from '../components/Form';
import { EmailInput } from '../components/Input';


export default class PasswordReset extends PureComponent {
  state = {
    loading: false,
    buttonText: 'SEND',
    requestSent: false,
    email: '',
  };

  goBack = () => this.props.navigation.goBack();

  setEmail = email => this.setState({ email });

  submit = async () => {
    Keyboard.dismiss();
    this.setState({
      requestSent: true,
      buttonText: 'CHECK YOUR EMAIL',
    });
  }

  render() {
    const isEnabled = isEmail(this.state.email) && !this.state.requestSent;
    return (
      <EntryForm>
        <View height={80} style={{ justifyContent: 'center' }}>
          <EmailInput value={this.state.email} onChangeText={this.setEmail} submit={this.submit} />
        </View>
        {this.state.loading ? <ActivityIndicator size="large" color="#fff" marginTop={50} /> : (
          <Fragment>
            <ButtonIconRight
              text={this.state.buttonText}
              icon="mail"
              onPress={this.submit}
              disabled={!isEnabled}
            />
            <BackButton onPress={this.goBack} />
          </Fragment>
        )}
      </EntryForm>
    );
  }
}
