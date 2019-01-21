import { BackButton, ButtonIconRight } from '../components/Button';
import { EntryForm } from '../components/Form';
import { EmailInput } from '../components/Input';
import { Keyboard, View } from 'react-native';
import React, { Fragment, PureComponent } from 'react';
import isEmail from 'validator/lib/isEmail';


export default class PasswordReset extends PureComponent {
  state = {
    loading: false,
    buttonText: 'SEND',
    requestSent: false,
    email: '',
  };

  goBack = () => this.props.navigation.goBack();

  setEmail = (email) => this.setState({ email });

  submit = async () => {
    Keyboard.dismiss();
    this.setState({
      requestSent: true,
      buttonText: 'CHECK YOUR EMAIL'
    });
  }

  render() {
    const isEnabled = isEmail(this.state.email) && !this.state.requestSent;
    return (
      <EntryForm>
        <View height={80} style={{ justifyContent: 'center' }}>
          <EmailInput value={this.state.email} onChangeText={this.setEmail} submit={this.submit}/>
        </View>
        {this.state.loading ? <ActivityIndicator size='large' color='#fff' marginTop={50} /> : (
          <Fragment>
            <ButtonIconRight
              text={this.state.buttonText}
              icon='mail'
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
