import { parseEvent, postEvent } from '../api/event';
import { colors } from '../config/styles';
import { parseMonthDayYear, parseTime } from '../lib/time';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, CheckBox, FormInput, FormLabel } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';


const { width } = Dimensions.get('screen');


@inject('eventStore', 'tokenStore')
@observer
export default class CreateEvent extends Component {
  state = {
    loading: false,
    dayPickerVisible: false,
    startPickerVisible: false,
    endPickerVisible: false,
    image: null,
    title: '',
    description: '',
    servings: null,
    organization: '',
    address: '',
    location: '',
    startDate: null,
    endDate: null,
    glutenFree: false,
    dairyFree: false,
    vegetarian: false,
    vegan: false,
  };

  componentWillMount() {
    // setting initial event times
    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 1);
    this.setState({ startDate, endDate });
  }

  getImage = () => {
    console.log('...getting image');
  }

  setTitle = (title) => this.setState({ title });

  setDescription = (description) => this.setState({ description });

  setServings = (servings) => this.setState({ servings });

  setOrganization = (organization) => this.setState({ organization });

  setAddress = (address) => this.setState({ address });

  setLocation = (location) => this.setState({ location });

  showDayPicker = () => this.setState({ dayPickerVisible: true });

  hideDayPicker = () => this.setState({ dayPickerVisible: false });

  showStartPicker = () => this.setState({ startPickerVisible: true });

  hideStartPicker = () => this.setState({ startPickerVisible: false });

  showEndPicker = () => this.setState({ endPickerVisible: true });

  hideEndPicker = () => this.setState({ endPickerVisible: false });

  setDay = (date) => {
    this.hideDayPicker();
    const start = this.state.startDate;
    const end = this.state.endDate;
    start.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    end.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.setState({ startDate: start, endDate: end });
  }

  setStartTime = (time) => {
    this.hideStartPicker();
    const startDate = this.state.startDate;
    startDate.setHours(time.getHours());
    startDate.setMinutes(time.getMinutes());
    const endDate = startDate > this.state.endDate ? new Date(startDate) : this.state.endDate;
    this.setState({ startDate, endDate });
  }

  setEndTime = (time) => {
    this.hideEndPicker();
    const end = this.state.endDate;
    end.setHours(time.getHours());
    end.setMinutes(time.getMinutes());
    this.setState({ endDate: end });
  }

  toggleGlutenFree = () => this.setState({ glutenFree: !this.state.glutenFree });

  toggleDairyFree = () => {
    const value = !this.state.dairyFree;
    this.setState({ dairyFree: value, vegan: value && this.state.vegan });
  }

  toggleVegetarian = () => {
    const value = !this.state.vegetarian;
    this.setState({ vegetarian: value, vegan: value && this.state.vegan });
  }

  toggleVegan = () => {
    const value = !this.state.vegan;
    this.setState({
      vegan: value,
      dairyFree: value || this.state.dairyFree,
      vegetarian: value || this.state.vegetarian,
    });
  }

  submit = () => {
    console.log('creating event...');
    this.setState({ loading: true });
    this.props.tokenStore.getOrFetchAccessToken()
    .then(token => postEvent(token, this.postData()))
    .then(event => this.props.eventStore.addEvent(parseEvent(event)))
    .then(() => this.props.navigation.goBack())
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  postData = () => {
    const foodPrefs = [];
    if (this.state.glutenFree) {
      foodPrefs.push(1);
    }
    if (this.state.dairyFree) {
      foodPrefs.push(2);
    }
    if (this.state.vegetarian) {
      foodPrefs.push(3);
    }
    if (this.state.vegan) {
      foodPrefs.push(4);
    }
    return {
      title: this.state.title,
      details: this.state.description,
      servings: this.state.servings,
      address: this.state.address,
      location: this.state.location,
      start_date: this.state.startDate,
      end_date: this.state.endDate,
      address: this.state.address,
      food_preferences: foodPrefs,
      latitude: '',
      longitude: '',
    };
  }

  cancel = () => {
    this.props.navigation.goBack();
  }

  _handleError = (err) => {
    Alert.alert(
      'Error',
      'An error occurred. Please try again later.',
      { text: 'OK' },
    );
  }

  validate = () => {
    return this.state.title &&
           this.state.description &&
           this.state.servings &&
           this.state.organization &&
           this.state.address &&
           this.state.location;
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps='never'
        width={width}
        backgroundColor={colors.lightBackground}
      >
        {this.state.image ? (
          <Image source={{ uri: this.state.image }} style={{ width, height: width }} />
        ) : (
          <View width={width} alignItems='center'>
            <Button
              title='Add photo'
              icon={{ name: 'camera', size: 18, color: colors.softWhite }}
              onPress={this.getImage}
              buttonStyle={[styles.button, { width: width * 0.8, backgroundColor: colors.red }]}
              textStyle={{ color: colors.softWhite }}
            />
          </View>
        )}

        <FormLabel labelStyle={styles.label}>Title</FormLabel>
        <FormInput
          placeholder='E.g., "Best Tacos in Town"'
          maxLength={150}
          autoCapitalize='words'
          onChangeText={this.setTitle}
          inputStyle={styles.input}
        />

        <FormLabel labelStyle={styles.label}>Description</FormLabel>
        <FormInput
          placeholder='E.g., Chicken, bacon, sushi, salad, and tacos! You name it, we got it!'
          maxLength={500}
          onChangeText={this.setDescription}
          multiline
          autoCapitalize='sentences'
          style={styles.inputLarge}
          inputStyle={styles.inputLarge}
          width={width - 20}
        />

        <FormLabel labelStyle={styles.label}>Available Servings</FormLabel>
        <FormInput
          placeholder='E.g., 25 people'
          maxLength={3}
          onChangeText={this.setServings}
          keyboardType='number-pad'
          inputStyle={styles.input}
        />

        <FormLabel labelStyle={styles.label}>Organization</FormLabel>
        <FormInput
          placeholder='E.g., University of Pittsburgh'
          maxLength={50}
          onChangeText={this.setOrganization}
          inputStyle={styles.input}
        />

        <FormLabel labelStyle={styles.label}>Address</FormLabel>
        <FormInput
          placeholder='E.g., "4200 Fifth Ave." or "Cathedral"'
          maxLength={100}
          autoCapitalize='words'
          onChangeText={this.setAddress}
          value={this.state.address}
        />

        <FormLabel labelStyle={styles.label}>Location Details</FormLabel>
        <FormInput
          placeholder='E.g., 4th floor, room 402'
          maxLength={255}
          onChangeText={this.setLocation}
          inputStyle={styles.input}
          style={{ borderColor: colors.red, borderWidth: 1 }}
        />

        <DateTimePicker
          mode='date'
          minimumDate={new Date()}
          isVisible={this.state.dayPickerVisible}
          date={this.state.startDate}
          onConfirm={this.setDay}
          onCancel={this.hideDayPicker}
        />
        <DateTimePicker
          mode='time'
          minimumDate={new Date()}
          isVisible={this.state.startPickerVisible}
          date={this.state.startDate}
          onConfirm={this.setStartTime}
          onCancel={this.hideStartPicker}
        />
        <DateTimePicker
          mode='time'
          minimumDate={this.state.startDate}
          isVisible={this.state.endPickerVisible}
          date={this.state.endDate}
          onConfirm={this.setEndTime}
          onCancel={this.hideEndPicker}
        />

        <FormLabel labelStyle={styles.label}>Date</FormLabel>
        <Button
          title={parseMonthDayYear(this.state.startDate)}
          onPress={this.showDayPicker}
          buttonStyle={styles.button}
          backgroundColor={colors.blue}
          color={colors.softGrey}
        />

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <FormLabel labelStyle={[styles.label, { marginTop: 10 }]}>Start Time</FormLabel>
            <Button
              title={parseTime(this.state.startDate)}
              onPress={this.showStartPicker}
              buttonStyle={styles.button}
              backgroundColor={colors.blue}
              color={colors.softGrey}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <FormLabel labelStyle={[styles.label, { marginTop: 10 }]}>End Time</FormLabel>
            <Button
              title={parseTime(this.state.endDate)}
              onPress={this.showEndPicker}
              buttonStyle={styles.button}
              backgroundColor={colors.blue}
              color={colors.softGrey}
            />
          </View>
        </View>


        <FormLabel labelStyle={styles.label}>Food Preferences</FormLabel>
        <CheckBox
          title='Gluten Free'
          checked={this.state.glutenFree}
          onPress={this.toggleGlutenFree}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <CheckBox
          title='Dairy Free'
          checked={this.state.dairyFree}
          onPress={this.toggleDairyFree}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <CheckBox
          title='Vegetarian'
          checked={this.state.vegetarian}
          onPress={this.toggleVegetarian}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />
        <CheckBox
          title='Vegan'
          checked={this.state.vegan}
          onPress={this.toggleVegan}
          containerStyle={styles.checkbox}
          checkedColor={colors.blue}
        />

        {this.state.loading ? <ActivityIndicator size='large' color={colors.darkGrey} marginVertical={30} /> : (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <Button
              title='CANCEL'
              onPress={this.cancel}
              backgroundColor={colors.red}
              buttonStyle={[styles.button, { width: width / 2.5, marginBottom: 20}]}
            />
            <Button
              title='SUBMIT'
              onPress={this.submit}
              backgroundColor='#009688'
              buttonStyle={[styles.button, { width: width / 2.5, marginBottom: 20}]}
              disabled={!this.validate()}
            />
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: colors.darkGrey,
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    color: '#607D8B',
  },
  inputLarge: {
    fontSize: 16,
    height: 100,
    color: '#607D8B',
  },
  button: {
    borderRadius: 10,
    paddingTop: 10,
    marginVertical: 10,
  },
  required: {
    fontSize: 16,
    color: '#607D8B',
    borderColor: colors.red,
    borderWidth: 1
  }
});
