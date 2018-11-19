import { hostAffiliations, hostSignup } from '../api/auth';
import { BackButton, Button, PrimaryButton } from '../components/Button';
import { EntryForm } from '../components/Form';
import { EmailInput, EntryInput, PasswordInput } from '../components/Input';
import { colors } from '../config/styles';
import { inject } from 'mobx-react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  InputAccessoryView,
  Keyboard,
  Linking,
  Modal,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import { Picker } from 'react-native-picker-dropdown';
import Gate from '../components/Gate';
import React, { Fragment, PureComponent } from 'react';
import isEmail from 'validator/lib/isEmail';


const width = Dimensions.get('window').width;


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
    showDisclaimer: false,
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

  showDisclaimer = () => this.setState({ showDisclaimer: true });

  hideDisclaimer = () => this.setState({ showDisclaimer: false });

  goToDisclaimer = () => Linking.openURL("https://pittgrub.com");

  hostTraining = () => {
    this.hideDisclaimer();
    this.props.navigation.navigate('HostTraining');
  }

  submit = () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    hostSignup(this.state.email, this.state.password, this.state.name, this.state.affiliation, this.state.directory, this.state.reason)
    .then(this.props.userStore.loadUserProfile)
    .then(() => {
      if (this.props.userStore.account.active) {
        // continue if user account is active
        this.props.navigation.navigate('Home')
      } else {
        this.props.tokenStore.getOrFetchAccessToken()
        .then(checkGate)
        .then(gated => gated ? this.setState({ enableGate: true }) : this.props.navigation.navigate('HostTraining'));
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
        <Modal animationType='slide' transparent visible={this.state.showDisclaimer}>
          <View height={400}>
            <View width={width-50} height={80} borderRadius={10} backgroundColor={colors.softGrey} marginHorizontal={20} marginTop={100} style={{flex: 1, flexDirection: 'column', alignItems: 'center', shadowColor: '#333', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 0.8, shadowRadius: 2}}>
              <View marginTop={80}>
                <Text marginTop={80} marginHorizontal={10} fontSize={18}>
                  By clicking continue you agree to the terms and conditions of hosting food on PittGrub.{' '}
                  <Text onPress={this.goToDisclaimer} style={{textDecorationLine: 'underline', textDecorationColor: '#333'}}>
                    Review PittGrub's terms and conditions.
                  </Text>
                </Text>
                <View marginTop={40} style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                  <PrimaryButton text='Continue' onPress={this.submit} buttonStyle={{width: 120, height: 40, backgroundColor: colors.blue}} textStyle={{fontSize: 16}} />
                  <BackButton text='Back' onPress={this.hideDisclaimer} buttonStyle={{width: 120, height: 40}} textStyle={{fontSize: 16}} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
        <Button text='Disclaimer' onPress={() => Linking.openURL("https://pittgrub.com").catch(() => console.log('no that did not work'))} />
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
          // inputAccessoryViewID='loginAccessory'
          multiline
          autoCapitalize='sentences'
          style={styles.inputLarge}
          inputStyle={styles.inputLarge}
          containerStyle={{borderBottomWidth: 0}}
        />
        <View style={{alignContent: 'center', alignItems: 'center', marginTop: 5}}>
          <Text style={{fontSize: 18, color: colors.softGrey}}>By clicking "SUBMIT" you agree to the terms and conditions of hosting food on PittGrub.</Text>
        </View>
        <View height={142}>
          {this.state.loading ? <ActivityIndicator color='#fff' size='large' marginTop={50} /> : (
            <Fragment>
              <Button text='SUBMIT' onPress={this.showDisclaimer} disabled={!this.validate()} />
              <BackButton onPress={this.goBack} />
            </Fragment>
          )}
        </View>
        {/* <InputAccessoryView nativeID='loginAccessory'>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}} backgroundColor='white' width={width}>
            <Text>Forgot password?</Text>
            <Text onPress={() => Alert.alert('hello!')}>Done</Text>
          </View>
        </InputAccessoryView> */}
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
});
