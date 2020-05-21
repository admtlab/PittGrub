import React, { Fragment, PureComponent } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import { Picker } from 'react-native-picker-dropdown';
import isEmail from 'validator/lib/isEmail';
import { hostAffiliations } from '../api/auth';
import { BackButton, Button } from '../components/Button';
import { EntryForm } from '../components/Form';
import { EmailInput, EntryInput, PasswordInput } from '../components/Input';
import { colors } from '../config/styles';


const { width } = Dimensions.get('window');


export default class HostSignup extends PureComponent {
  static affiliations = [];

  state = {
    loading: false,
    email: '',
    password: '',
    name: '',
    affiliation: null,
    reason: '',
  };

  componentDidMount() {
    if (!HostSignup.affiliations.length) {
      hostAffiliations().then(affiliations => (
        HostSignup.affiliations.splice(
          0,
          HostSignup.affiliations.length,
          ...affiliations,
        )
      ));
    }
  }

  goBack = () => this.props.navigation.goBack();

  passwordInputFocus = () => this.refs.passwordInput.focus();

  nameInputFocus = () => this.refs.nameInput.focus();

  setEmail = email => this.setState({ email });

  setPassword = password => this.setState({ password });

  setName = name => this.setState({ name });

  setAffiliation = affiliation => this.setState({ affiliation });

  setReason = reason => this.setState({ reason });

  hostTraining = () => this.props.navigation.navigate('HostTraining', {...this.state});

  validate = () => (
    isEmail(this.state.email)
      && this.state.password
      && this.state.name
      && this.state.affiliation
  );

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="never" backgroundColor={colors.blue}>
        <EntryForm>
          <EmailInput
            placeholder="Pitt Email Address"
            value={this.state.email}
            onChangeText={this.setEmail}
            submit={this.passwordInputFocus}
          />
          <PasswordInput
            ref='passwordInput'
            placeholder="Choose a Secure Password"
            value={this.state.password}
            onChangeText={this.setPassword}
            submit={this.nameInputFocus}
          />
          <EntryInput
            ref='nameInput'
            placeholder="Your Name"
            value={this.state.name}
            onChangeText={this.setName}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <FormLabel labelStyle={styles.label}>Primary Affiliation</FormLabel>
          <Picker
            ref='affiliationPicker'
            selectedValue={this.state.affiliation}
            onValueChange={itemValue => this.setState({ affiliation: itemValue })}
            style={styles.picker}
            textStyle={styles.pickerText}
          >
            {HostSignup.affiliations.map(item => (
              <Picker.Item
                key={item.id}
                label={item.name}
                value={item.id}
              />
            ))}
          </Picker>
          <FormLabel labelStyle={styles.label}>Reason</FormLabel>
          <FormInput
            ref='reasonInput'
            placeholder="Optional, but will help us respond faster."
            maxLength={250}
            onChangeText={this.setReason}
            // inputAccessoryViewID='loginAccessory'
            multiline
            autoCapitalize="sentences"
            style={styles.inputLarge}
            inputStyle={styles.inputLarge}
            containerStyle={{ borderBottomWidth: 0 }}
          />
          <View height={142}>
            {this.state.loading ? <ActivityIndicator color="#fff" size="large" marginTop={50} /> : (
              <Fragment>
                <Button text="NEXT" onPress={this.hostTraining} disabled={!this.validate()} />
                <BackButton onPress={this.goBack} />
              </Fragment>
            )}
          </View>
        </EntryForm>
      </ScrollView>
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
    height: 80,
    paddingHorizontal: 10,
  },
});
