import { resendVerification, submitVerification } from '../api/auth';
import { registerForNotifications, setExpoPushToken } from '../api/notification';
import { Button, ButtonIconRight } from '../components/Button';
import { EntryForm } from '../components/Form';
import { colors } from '../config/styles';
import inputStyle from '../components/Input/styles';
import { inject } from 'mobx-react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  TextInput,
} from 'react-native';
import React, { Fragment, PureComponent } from 'react';


const { width } = Dimensions.get('window');


@inject('featureStore', 'tokenStore', 'userStore')
export default class Verification extends PureComponent {
  state = {
    loading: false,
    resended: false,
    resendText: 'RESEND',
    code: '',
  };

  _goBack = () => {
    this.props.navigation.goBack();
  }

  _setCode = (code) => {
    this.setState({ code: code.toUpperCase() });
  }

  _submit = async () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    this.props.tokenStore.getOrFetchAccessToken()
    .then(token => submitVerification(token, this.state.code))
    .then(() => {
      if (!this.props.featureStore.features.notifications) {
        registerForNotifications().then(granted => {
          this.props.featureStore.setFeatures({ notifications: granted });
          if (granted) {
            this.props.tokenStore.getOrFetchAccessToken().then(setExpoPushToken);
          }
        })
      }
    })
    .then(() => this.props.navigation.navigate('Main'))
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  _resendVerification = async () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    this.props.tokenStore.getOrFetchAccessToken()
    .then(resendVerification)
    .then(() => this.setState({ resended: true, resendText: 'CHECK YOUR EMAIL' }))
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  _handleError = () => {
    Alert.alert('Error', 'An error occurred, please try again later.', { text: 'OK' });
  }

  render() {
    const enableSubmit = this.state.code.length === 6;

    return (
      <EntryForm>
        <TextInput
          placeholder='Verification Code'
          value={this.state.code}
          maxLength={6}
          autoCapitalize='characters'
          autoCorrect={false}
          returnKeyType='send'
          clearButtonMode='always'
          onChangeText={this._setCode}
          onSubmitEditing={this._submit}
          style={inputStyle.input}
          inputStyle={{ fontSize: 20 }}
          placeholderTextColor={colors.text}
        />
        {this.state.loading ? (
          <ActivityIndicator size='large' color='#fff' marginTop={30} />
        ) : (
          <Fragment>
            <Button
              text='SUBMIT'
              onPress={this._submit}
              disabled={!enableSubmit}
            />
            <ButtonIconRight
              text={this.state.resendText}
              icon='mail'
              onPress={this._resendVerification}
              disabled={this.state.resended}
            />
          </Fragment>
        )}
      </EntryForm>
    );
  }
}
