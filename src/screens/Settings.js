import { updateProfile } from '../api/user';
import { colors } from '../config/styles';
import { parseMonthYear } from '../lib/time';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Button, ButtonGroup, CheckBox, FormLabel } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';

@inject('tokenStore', 'userStore')
@observer
export default class Settings extends Component {
  static statuses = ['Student', 'Faculty/Staff'];

  state = {
    loading: false,
    statusIndex: 0,
    graduationDate: new Date(),
    graduationDatePickerVisible: false,
  };

  hideGraduationPicker = () => this.setState({ graduationDatePickerVisible: false });

  handleGraduationPicked = (date) => {
    this.setState({
      graduationDatePickerVisible: false,
      graduationDate: date,
    });
  }
  
  updateStatus = (index) => {
    this.setState({
      statusIndex: index,
      graduationDatePickerVisible: index === 0,
    });
  }

  updatePreferences = () => {
    const { tokenStore, userStore } = this.props;
    console.log(userStore);
    this.setState({ loading: true });
    tokenStore.getOrFetchAccessToken()
    .then(token => updateProfile(token, {
      food_preferences: userStore.foodPreferences,
      pantry: userStore.pantry
    }))
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  logout = () => {
    const { tokenStore, userStore } = this.props;
    tokenStore.clearTokens();
    userStore.clearUser();
    this.props.navigation.navigate('Entrance');
  }

  _handleError = () => {
    Alert.alert(
      'Error',
      'An error occurred. Please try again later',
      { text: 'OK' },
    );
  }

  render() {
    const { userStore } = this.props;

    return (
      <ScrollView style={{ backgroundColor: colors.lightBackground }}>
        {/* Pantry settings */}
        <FormLabel labelStyle={styles.title}>Pitt Pantry</FormLabel>
        <Text style={styles.description}>
          Check this box if you are a member of the Pitt Pantry. This will increase your likelihood of being sent event notifications. This information is kept confidential.
        </Text>
        <CheckBox
          title='Member'
          checked={userStore.pantry}
          onPress={() => userStore.togglePantry()}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />

        {/* Status settings */}
        <FormLabel labelStyle={styles.title}>University Status</FormLabel>
        <Text style={styles.description}>
          By letting us know your status at Pitt we can better tailor your experience.
        </Text>
        <ButtonGroup
          onPress={this.updateStatus}
          selectedIndex={this.state.statusIndex}
          selectedBackgroundColor='#009688'
          textStyle={{ color: colors.text }}
          buttons={Settings.statuses}
        />

        {/* Graduation settings */}
        {this.state.statusIndex === 0 && (
          <Fragment>
            <FormLabel labelStyle={styles.title}>Graduation Date</FormLabel>
            <Text style={styles.description}>
              Letting us know of your expected graduation date will inform us of when to stop sending you notifications.
            </Text>
            <Text style={[styles.description, {marginTop: 10}]}>{parseMonthYear(this.state.graduationDate)}</Text>
            <DateTimePicker
              mode='date'
              date={this.state.graduationDate}
              minimumDate={new Date}
              isVisible={this.state.graduationDatePickerVisible}
              onConfirm={this.handleGraduationPicked}
              onCancel={this.hideGraduationPicker}
            />
          </Fragment>
        )}

        {/* Food preference settings */}
        <FormLabel labelStyle={styles.title}>Food Preferences</FormLabel>
        <Text style={styles.description}>
          We will only send notifications for food eents that match your preferences.
        </Text>
        <CheckBox
          title='Gluten Free'
          checked={userStore.foodPreferences.some(f => f === 1)}
          onPress={() => userStore.toggleFoodPreference(1)}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <CheckBox
          title='Dairy Free'
          checked={userStore.foodPreferences.some(f => f === 2)}
          onPress={() => userStore.toggleFoodPreference(2)}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <CheckBox
          title='Vegetarian'
          checked={userStore.foodPreferences.some(f => f === 3)}
          onPress={() => userStore.toggleFoodPreference(3)}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <CheckBox
          title='Vegan'
          checked={userStore.foodPreferences.some(f => f === 4)}
          onPress={() => userStore.toggleFoodPreference(4)}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <Button
          title='SAVE'
          onPress={this.updatePreferences}
          loading={this.state.loading}
          backgroundColor='#009688'
          borderRadius={10}
          containerViewStyle={styles.button}
        />
        
        {/* Account */}
        <FormLabel labelStyle={styles.title}>Account</FormLabel>
        <Button
          title='LOG OUT'
          onPress={this.logout}
          backgroundColor='rgb(231, 76, 60)'
          borderRadius={10}
          containerViewStyle={[styles.button, { marginBottom: 20 }]}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
  },
  button: {
    paddingVertical: 10
  },
});
