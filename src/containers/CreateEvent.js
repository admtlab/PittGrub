import moment from 'moment';
import React from 'react';

import { View, Image, StyleSheet, Text, ScrollView, TouchableHighlight, TextInput } from 'react-native'
import { FormLabel, FormInput, CheckBox, Button, Grid, Col, Slider } from 'react-native-elements'
import metrics from '../config/metrics';
import colors from '../config/styles';
import settings from '../config/settings';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { NavigationActions } from 'react-navigation';
import lib from '../lib/scripts';
import images from '../config/images';

const createEventURL = settings.server.url + '/events';

// styles
const styles = StyleSheet.create({
  button: {
    paddingTop: 10,
  },
  submitButton: {
    paddingTop: 10,
    paddingBottom: 20
  },
  checkboxContainer: {
    backgroundColor: '#fff',

  },
  viewContainer: {
    backgroundColor: '#fff',
    width: metrics.screenWidth,
    height: metrics.screenHeight - metrics.tabBarHeight,
    zIndex: 100
  },
  textLabel: {
    color: 'steelblue'
  },
  textboxNormal: {
    color: '#607D8B',
    fontSize: 15
  },
  textboxLarge: {
    height: 50,
    color: '#607D8B',
    fontSize: 15

  },
  foodCheckBoxContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  }
})

export default class CreateEventView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      glutenFree: false,
      dairyFree: false,
      vegetarian: false,
      vegan: false,
      isDateTimePickerStartVisible: false,
      isDateTimePickerEndVisible: false,
      startDate: new Date(),
      endDate: new Date(),
      organization: '',
      title: '',
      location_details: '',
      address: '',
      serving: 0,
      description: ''
    }

    this._showDateTimePickerEnd = this._showDateTimePickerEnd.bind(this);
    this._hideDateTimePickerEnd = this._hideDateTimePickerEnd.bind(this);
    this._showDateTimePickerStart = this._showDateTimePickerStart.bind(this);
    this._hideDateTimePickerStart = this._hideDateTimePickerStart.bind(this);
    this._handleStartDatePicked = this._handleStartDatePicked.bind(this);
    this._handleEndDatePicked = this._handleEndDatePicked.bind(this);
    this._postEvent = this._postEvent.bind(this);

  }

  _showDateTimePickerStart = () => this.setState({ isDateTimePickerStartVisible: true });

  _hideDateTimePickerStart = () => this.setState({ isDateTimePickerStartVisible: false });

  _showDateTimePickerEnd = () => this.setState({ isDateTimePickerEndVisible: true });

  _hideDateTimePickerEnd = () => this.setState({ isDateTimePickerEndVisible: false });

  _handleStartDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this._hideDateTimePickerStart();
    this.setState({ startDate: date })
  };

  _handleEndDatePicked = (date) => {
    this._hideDateTimePickerEnd();
    this.setState({ endDate: date })
  }


  _mapFoodPreferences = () => {

  }


  _postEvent = () => {
    let foodprefs = [];
    if (this.state.glutenFree)
      foodprefs.push(1);
    if (this.state.dairyFree)
      foodprefs.push(2);
    if (this.state.vegetarian)
      foodprefs.push(3);
    if (this.state.vegan)
      foodprefs.push(4);

    body = JSON.stringify({
        title: this.state.title,
        details: this.state.description,
        address: this.state.address,
        location: this.state.location_details,
        servings: parseInt(this.state.serving),
        start_date: this.state.startDate,
        end_date: this.state.endDate,
        food_preferences: foodprefs,
      })
    console.log('body: \n' + body)
    fetch(createEventURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    })
  }

  render() {
    return (
      <ScrollView style={styles.viewContainer}>

        <FormLabel labelStyle={styles.textLabel}>Event Title</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. Best Tacos In Town'}
          maxLength={20}
          onChangeText={(text) => this.setState({ title: text })}
        />

        <FormLabel labelStyle={styles.textLabel}>Organization</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. University of Pittsburgh'}
          maxLength={20}
          onChangeText={(text) => this.setState({ organization: text })}
        />

        <FormLabel labelStyle={styles.textLabel}>Address</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. 4200 Fifth Ave, Pittsburgh, PA 15260'}
          maxLength={20}
          onChangeText={(text) => this.setState({ address: text })}
        />

        <FormLabel labelStyle={styles.textLabel}>Location Details</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. 4th floor, Room 125'}
          maxLength={20}
          onChangeText={(text) => this.setState({ location_details: text })}
        />

        <FormLabel labelStyle={styles.textLabel}>Event Description</FormLabel>
        <FormInput
          style={styles.textboxLarge}
          multiline={true}
          placeholderTextColor="#bdc6cf"
          placeholder={'E.g. Fish, chicken, bacon, sushi tacos! You name it we got it! '}
          maxLength={150}
          onChangeText={(text) => this.setState({ description: text })}
        />
        <FormLabel labelStyle={styles.textLabel}>Available Servings</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          keyboardType='number-pad'
          placeholder={'E.g. 25 people'}
          maxLength={3}
          onChangeText={(text) => this.setState({ serving: text })}
        />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerStartVisible}
          mode='datetime'
          onConfirm={this._handleStartDatePicked}
          onCancel={this._hideDateTimePickerStart}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerEndVisible}
          mode='time'
          onConfirm={this._handleEndDatePicked}
          onCancel={this._hideDateTimePickerEnd}
        />

        <Grid>
          <Col>
            <FormLabel labelStyle={styles.textLabel}>Start Date & Time</FormLabel>
            <Button
              title={lib._convertDate(this.state.startDate)}
              backgroundColor='#FFC107'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              color='#607D8B'
              onPress={this._showDateTimePickerStart}
            />


          </Col>
          <Col>
            <FormLabel labelStyle={styles.textLabel}>Ending Time</FormLabel>
            <Button
              title={lib._convertHoursMin(this.state.endDate)}
              backgroundColor='#FFC107'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              color='#607D8B'
              onPress={this._showDateTimePickerEnd}
            />
          </Col>
        </Grid>

        <FormLabel labelStyle={styles.textLabel}>Food Preferences</FormLabel>
        <CheckBox
          title='Gluten Free'
          checked={this.state.glutenFree}
          onPress={() => {
            this.setState({ glutenFree: !this.state.glutenFree })
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        <CheckBox
          title='Dairy Free'
          checked={this.state.dairyFree}
          onPress={() => {
            this.setState({ dairyFree: !this.state.dairyFree })
          }}
          checkedColor='#009688'
          containerStyle={styles.checkboxContainer}
        />

        <CheckBox
          title='Vegetarian'
          checked={this.state.vegetarian}
          onPress={() => {
            this.setState({ vegetarian: !this.state.vegetarian })
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            borderColor: '#ededed',
            borderWidth: 1,
            padding: 10,
            borderRadius: 3,
            margin: 5,
            marginRight: 10,
            marginLeft: 10}}>
          <CheckBox
            style={{backgroundColor: '#fff'}}
            title='Vegan'
            checked={this.state.vegan}
            onPress={() => {
              this.setState({ vegan: !this.state.vegan })
              if (!this.state.vegan) {
                this.setState({ dairyFree: true })
                this.setState({ vegetarian: true })
              }
            }}
            checkedColor='#009688'
            //containerStyle={styles.checkboxContainer}
          />
          <TouchableHighlight
            style={{
              flex: 1,
              alignContent: 'center',
              marginTop: -4,
              justifyContent: 'center',
              alignItems: 'flex-end'}}>
            <Image
              resizeMode='center'
              source={images.info}
            />
          </TouchableHighlight>
        </View>

        <Grid>
          <Col>
            <Button
              containerViewStyle={{padding: 0, margin: 0}}
              title='CANCEL'
              backgroundColor='#de342f'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              onPress={() => {
                this.props.navigation.goBack(null)
            }}/>
          </Col>
          <Col>
            <Button
              containerViewStyle={{padding: 0, margin: 0}}
              title='SUBMIT'
              backgroundColor='#009688'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              onPress={() => {
                this._postEvent();
                this.props.navigation.goBack(null);
            }}/>
          </Col>
        </Grid>

        {/*<View style={{paddingBottom: -10}}>
          <Button
            style={{paddingBottom: -10}}
            large
            title='SUBMIT'
            backgroundColor='#009688'
            borderRadius={10}
            containerViewStyle={styles.submitButton}
            onPress={() => {
              this._postEvent('http://db10.cs.pitt.edu:8080/event')
              this.props.navigation.goBack(null)
            }}/>
            <Button
            large
            title='CANCEL'
            backgroundColor='#de342f'
            borderRadius={10}
            containerViewStyle={styles.submitButton}
            onPress={() => {
              this.props.navigation.goBack(null)
            }}/>
        </View>*/}
      </ScrollView>
    );
  }
}
