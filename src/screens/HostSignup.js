import { hostAffiliations, hostSignup } from '../api/auth';
import { BackButton, Button } from '../components/Button';
import { EntryForm } from '../components/Form';
import { EmailInput, EntryInput, PasswordInput } from '../components/Input';
import { colors } from '../config/styles';
import { inject } from 'mobx-react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  StyleSheet,
  View
} from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import { Picker } from 'react-native-picker-dropdown';
import Gate from '../components/Gate';
import React, { Fragment, PureComponent } from 'react';
import isEmail from 'validator/lib/isEmail';


const { width, height } = Dimensions.get('window');


@inject('tokenStore', 'userStore')
export default class HostSignup extends PureComponent {
  static affiliations = [];

  state = {
    loading: false,
    email: '',
    password: '',
    name: '',
    affiliation: null,
    directory: '',
    reason: '',
    enableGate: false
  };

  componentDidMount() {
    if (!HostSignup.affiliations.length) {
      hostAffiliations().then(affiliations => {
        HostSignup.affiliations.splice(
          0,
          HostSignup.affiliations.length,
          ...affiliations,
        )
      });
    }
  }

  goBack = () => this.props.navigation.goBack();

  passwordInputFocus = () => this.refs.passwordInput.focus();

  nameInputFocus = () => this.refs.nameInput.focus();

  setEmail = (email) => this.setState({ email });

  setPassword = (password) => this.setState({ password });

  setName = (name) => this.setState({ name });

  setAffiliation = (affiliation) => this.setState({ affiliation });

  setDirectory = (directory) => this.setState({ directory });

  setReason = (reason) => this.setState({ reason });

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

  validate = () => {
    return isEmail(this.state.email) &&
          this.state.password &&
          this.state.name &&
          this.state.affiliation &&
          this.state.directory;
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this.goBack} />;
    }

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
          submit={this.nameInputFocus}
        />
        <EntryInput
          ref='nameInput'
          placeholder='Your Name'
          value={this.state.name}
          onChangeText={this.setName}
          autoCapitalize='words'
          returnKeyType='next'
        />
        <FormLabel labelStyle={styles.label}>Primary Affiliation</FormLabel>
        <Picker
          ref='affiliationPicker'
          selectedValue={this.state.affiliation}
          onValueChange={(itemValue) => this.setState({ affiliation: itemValue })}
          style={styles.picker}
          textStyle={styles.pickerText}
        >
          {HostSignup.affiliations.map(item => {
            return (
              <Picker.Item
                key={item.id}
                label={item.name}
                value={item.id}
              />
            );
          })}
        </Picker>
        <EntryInput
          ref='directoryInput'
          placeholder='Directory'
          value={this.state.directory}
          onChangeText={this.setDirectory}
          returnKeyType='next'
        />
        <FormLabel labelStyle={styles.label}>Reason</FormLabel>
        <FormInput
          ref='reasonInput'
          placeholder='Optional, but will help us respond faster.'
          maxLength={250}
          onChangeText={this.setReason}
          multiline
          autoCapitalize='sentences'
          style={styles.inputLarge}
          inputStyle={styles.inputLarge}
          containerStyle={{borderBottomWidth: 0}}
        />
        <View height={142}>
          {this.state.loading ? <ActivityIndicator color='#fff' size='large' marginTop={50} /> : (
            <Fragment>
              <Button text='REQUEST HOST' onPress={this.submit} disabled={!this.validate()} />
              <BackButton onPress={this.goBack} />
            </Fragment>
          )}
        </View>
      </EntryForm>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: width / 20,
    marginTop: 0,
  },
  picker: {
    backgroundColor: colors.transparentTextEntry,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    height: 30,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  pickerText: {
    fontSize: width / 20,
    color: colors.softGrey,
  },
  inputLarge: {
    fontSize: 18,
    color: colors.softGrey,
    backgroundColor: colors.transparentTextEntry,
    borderBottomWidth: 0,
    borderRadius: 1,
    width: width - 40,
    height: 100,
    paddingHorizontal: 10,
  },
})
