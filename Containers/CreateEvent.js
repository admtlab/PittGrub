import moment from 'moment';
import React from 'react';

import {View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {FormLabel, FormInput, CheckBox, Button, Grid, Col, Slider} from 'react-native-elements'
import Metrics from '../Styles/Metrics'
import Colors from '../Styles/Colors'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { NavigationActions } from 'react-navigation'
import lib from '../library/scripts'

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
    width: Metrics.screenWidth,
    height: Metrics.screenHeight - Metrics.tabBarHeight,
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
      vegan: false,
      vegetarian: false,
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


  _postEvent = (url) => {
    fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
       title: this.state.title,
       details: this.state.description,
       organization: this.state.organization,
       address: this.state.address,
       location: this.state.location_details,
       servings: this.state.serving,
       startDate: this.state.startDate,
       endDate: this.state.endDate,
      
    })
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
          onChangeText={(text) => this.setState({title: text})}
        />

        <FormLabel labelStyle={styles.textLabel}>Organization</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. University of Pittsburgh'}
          maxLength={20}
          onChangeText={(text) => this.setState({organization: text})}
        />

        <FormLabel labelStyle={styles.textLabel}>Address</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. 4200 Fifth Ave, Pittsburgh, PA 15260'}
          maxLength={20}
          onChangeText={(text) => this.setState({address: text})}
        />

         <FormLabel labelStyle={styles.textLabel}>Location Details</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. 4th floor, Room 125'}
          maxLength={20}
          onChangeText={(text) => this.setState({location_details: text})}
        />

        <FormLabel labelStyle={styles.textLabel}>Event Description</FormLabel>
        <FormInput
          style={styles.textboxLarge}
          multiline={true}
          placeholderTextColor="#bdc6cf"
          placeholder={'E.g. Fish, chicken, bacon, sushi tacos! You name it we got it! '}
          maxLength={150}
          onChangeText={(text) => this.setState({description: text})}
        />
        <FormLabel labelStyle={styles.textLabel}>Available Servings</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          keyboardType='number-pad'
          placeholder={'E.g. 25 people'}
          maxLength={3}
          onChangeText={(text) => this.setState({serving: text})}
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
                borderRadius= {10}
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
                borderRadius= {10}
                containerViewStyle={styles.submitButton}
                color='#607D8B'
                onPress={this._showDateTimePickerEnd}
                />
            </Col>
        </Grid>


        <FormLabel labelStyle={styles.textLabel}>Food Preferences</FormLabel>
      
        <CheckBox
          title='Vegetarian'
          checked={this.state.vegetarian}
          onPress={()=>{
            this.setState({vegetarian: !this.state.vegetarian})
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        <CheckBox
          title='Vegan'
          checked={this.state.vegan}
          onPress={()=>{
            this.setState({vegan: !this.state.vegan})
          }}
          checkedColor='#009688'
          containerStyle={styles.checkboxContainer}
        />

        <Button 
          large
          title='SUBMIT'
          backgroundColor='#009688'
          borderRadius= {10}
          containerViewStyle={styles.submitButton}
          onPress={()=>{
            this._postEvent('http://db10.cs.pitt.edu:8080/event')
            this.props.navigation.goBack(null)
            }}
          />
      </ScrollView>
    );
  }
}