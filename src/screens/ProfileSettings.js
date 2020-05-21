import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {
  Button,
  ButtonGroup,
  CheckBox,
  FormLabel,
} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { NavigationEvents } from 'react-navigation';
import { updateProfile } from '../api/user';
import { parseMonthDayYear } from '../common/time';
import { handleError } from '../common/util';
import { colors } from '../config/styles';


@inject('tokenStore', 'userStore')
@observer
export default class ProfileSettings extends Component {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
    tokenStore: PropTypes.any.isRequired,
    userStore: PropTypes.any.isRequired,
  };

  static statuses = ['Student', 'Faculty/Staff'];

  constructor(props) {
    super(props);

    let status = 'Student';
    let statusIndex = 0;

    if (props.userStore.status) {
      // eslint-disable-next-line prefer-destructuring
      status = props.userStore.status;
      statusIndex = ProfileSettings.statuses.indexOf(status);
    }

    this.state = {
      loading: false,
      status,
      statusIndex,
      pantry: props.userStore.pantry || false,
      foodPreferences: props.userStore.foodPreferences.slice(),
      graduationDate: props.userStore.graduationDate || null,
      graduationDatePickerVisible: false,
    };
  }

  togglePantry = () => this.setState(prevState => ({ pantry: !prevState.pantry }));

  toggleFoodPreference = (foodPreference) => {
    // look for food preference
    if (this.state.foodPreferences.some(f => f === foodPreference)) {
      // remove if found
      this.setState(prevState => ({ foodPreferences: prevState.foodPreferences.filter(f => f !== foodPreference) }));
    } else {
      // not found, add it
      this.setState(prevState => ({ foodPreferences: [...prevState.foodPreferences, foodPreference] }));
    }
  }

  hideGraduationPicker = () => this.setState({ graduationDatePickerVisible: false });

  handleGraduationPicked = date => this.setState({ graduationDatePickerVisible: false, graduationDate: date });

  updateStatus = index => (
    this.setState(prevState => ({
      statusIndex: index,
      status: ProfileSettings.statuses[index],
      graduationDatePickerVisible: prevState.graduationDate === null,
    }))
  );

  selectGraduationDate = () => this.setState({ graduationDatePickerVisible: true });

  updatePreferences = () => {
    if (!this.compareSettings()) {
      // a setting has changed, update
      const { tokenStore, userStore } = this.props;
      this.setState({ loading: true });
      userStore.setProfile({
        pantry: this.state.pantry,
        foodPreferences: this.state.foodPreferences,
        status: this.state.status,
        graduationDate: this.state.status === ProfileSettings.statuses[0] ? this.state.graduationDate : null,
      });
      tokenStore.getOrFetchAccessToken()
        .then(token => updateProfile(token, {
          food_preferences: userStore.foodPreferences,
          pantry: userStore.pantry,
          status: userStore.status,
          graduation_date: userStore.graduationDate,
        }))
        .then(this.reset)
        .catch(e => handleError(e))
        .finally(() => this.setState({ loading: false }));
    }
  }

  compareSettings = () => {
    const { userStore } = this.props;
    return this.state.pantry === userStore.pantry
      && this.state.foodPreferences.every(f => userStore.foodPreferences.some(p => f === p))
      && userStore.foodPreferences.every(p => this.state.foodPreferences.some(f => f === p))
      && this.state.status === userStore.status
      && this.state.graduationDate === userStore.graduationDate;
  }

  reset = () => {
    const { userStore } = this.props;

    let status = 'Student';
    let statusIndex = 0;

    if (userStore.status) {
      // eslint-disable-next-line prefer-destructuring
      status = userStore.status;
      statusIndex = ProfileSettings.statuses.indexOf(status);
    }

    this.setState({
      loading: false,
      pantry: userStore.pantry,
      foodPreferences: userStore.foodPreferences.slice(),
      status,
      statusIndex,
      graduationDate: userStore.graduationDate,
      graduationDatePickerVisible: false,
    });
  }

  clearOnFocus = () => <NavigationEvents onWillFocus={this.reset} />;

  pantrySetting = () => (
    <Fragment>
      <FormLabel labelStyle={styles.title}>Pitt Pantry</FormLabel>
      <Text style={styles.description}>
        Check this box if you are a member of the Pitt Pantry.
        This will increase your likelihood of being sent event notifications.
        This information is kept confidential.
      </Text>
      <CheckBox
        title="Member"
        checked={this.state.pantry}
        onPress={this.togglePantry}
        containerStyle={styles.checkbox}
        checkedColor={colors.blue}
      />
    </Fragment>
  );

  statusSetting = () => (
    <Fragment>
      <FormLabel labelStyle={styles.title}>University Status</FormLabel>
      <Text style={styles.description}>
        By letting us know your status at Pitt we can better tailor your experience.
      </Text>
      <ButtonGroup
        onPress={this.updateStatus}
        selectedIndex={this.state.statusIndex}
        selectedBackgroundColor="#009688"
        textStyle={{ color: colors.text }}
        buttons={ProfileSettings.statuses}
      />
    </Fragment>
  );

  graduationSetting = () => (
    <Fragment>
      <FormLabel labelStyle={styles.title}>Graduation Date</FormLabel>
      <Text style={styles.description}>
        Letting us know of your expected graduation date will inform us of when to stop sending you notifications.
      </Text>
      <Button
        title={this.state.graduationDate
          ? parseMonthDayYear(this.state.graduationDate)
          : 'Not Set'}
        onPress={this.selectGraduationDate}
        backgroundColor={colors.blue}
        containerViewStyle={styles.button}
        borderRadius={10}
      />
      <DateTimePicker
        mode="date"
        titleIOS="Select your graduation date"
        date={this.state.graduationDate || new Date()}
        minimumDate={new Date()}
        isVisible={this.state.graduationDatePickerVisible}
        onConfirm={this.handleGraduationPicked}
        onCancel={this.hideGraduationPicker}
      />
    </Fragment>
  );

  foodPreferenceSetting = () => (
    <Fragment>
      <FormLabel labelStyle={styles.title}>Food Preferences</FormLabel>
      <Text style={styles.description}>
        We will only send notifications for food events that match your preferences.
      </Text>
      <CheckBox
        title="Gluten Free"
        checked={this.state.foodPreferences.some(f => f === 1)}
        onPress={() => this.toggleFoodPreference(1)}
        containerStyle={styles.checkbox}
        checkedColor={colors.blue}
      />
      <CheckBox
        title="Dairy Free"
        checked={this.state.foodPreferences.some(f => f === 2)}
        onPress={() => this.toggleFoodPreference(2)}
        containerStyle={styles.checkbox}
        checkedColor={colors.blue}
      />
      <CheckBox
        title="Vegetarian"
        checked={this.state.foodPreferences.some(f => f === 3)}
        onPress={() => this.toggleFoodPreference(3)}
        containerStyle={styles.checkbox}
        checkedColor={colors.blue}
      />
      <CheckBox
        title="Vegan"
        checked={this.state.foodPreferences.some(f => f === 4)}
        onPress={() => this.toggleFoodPreference(4)}
        containerStyle={styles.checkbox}
        checkedColor={colors.blue}
      />
    </Fragment>
  );

  render() {
    return (
      <ScrollView style={{ marginBottom: 20 }}>
        {this.clearOnFocus()}
        {this.pantrySetting()}
        {this.statusSetting()}
        {this.state.statusIndex === 0 && this.graduationSetting()}
        {this.foodPreferenceSetting()}
        <Button
          title="Save"
          onPress={this.updatePreferences}
          loading={this.state.loading}
          backgroundColor="#009688"
          borderRadius={10}
          containerViewStyle={styles.button}
        />
        <Button
          title="Reset"
          onPress={this.reset}
          backgroundColor={colors.red}
          borderRadius={10}
          containerViewStyle={styles.button}
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
    paddingVertical: 10,
  },
  item: {
    backgroundColor: 'snow',
  },
});
