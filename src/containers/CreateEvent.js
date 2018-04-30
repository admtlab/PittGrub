// import moment from 'moment';
import React from 'react';

import { View, Dimensions, Image, StyleSheet, Text, ScrollView, TouchableHighlight, TextInput } from 'react-native'
import { FormLabel, FormInput, CheckBox, Button, Grid, Col, Slider } from 'react-native-elements'
import { ImagePicker, MapView, Permissions, Location } from 'expo';
import metrics from '../config/metrics';
import colors from '../config/styles';
import settings from '../config/settings';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { NavigationActions } from 'react-navigation';
import lib from '../lib/scripts';
import { findBuilding, closest } from '../lib/location';
import images from '../config/images';
var AWS = require('aws-sdk/dist/aws-sdk-react-native');

const createEventURL = settings.server.url + '/events';
const { width, height } = Dimensions.get('window')
const defaultLatitude = 40.44158671;
const defaultLongitude = -79.95638251;
const latitudeDelta = 0.025;
const longitudeDelta = 0.01;
const defaultMapRegion = {
  latitude: defaultLatitude,
  longitude: defaultLongitude,
  latitudeDelta: latitudeDelta,
  longitudeDelta: longitudeDelta,
}
const defaultMarker = {
  key: 'Event',
  coordinate: {
    latitude: defaultLatitude,
    longitude: defaultLongitude,
  }
}

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
  },
  map: {
    position: 'relative',
    zIndex: 999,
    paddingTop: 10,
    marginTop: 10,
    width: metrics.screenWidth - 30,
    left: 15,
    height: 400,
    borderRadius: 10,
  },
})

export default class CreateEventView extends React.Component {

  constructor(props) {
    super(props);
    let startDate = new Date();
    let endDate = new Date();
    endDate.setHours(endDate.getHours()+1);
    endDate.setMinutes(Math.ceil(endDate.getMinutes()/30)*30);
    this.state = {
      image: null,
      glutenFree: false,
      dairyFree: false,
      vegetarian: false,
      vegan: false,
      isDayPickerVisible: false,
      isDateTimePickerStartVisible: false,
      isDateTimePickerEndVisible: false,
      startDate: startDate,
      endDate: endDate,
      organization: '',
      eventId: null,      
      title: '',
      address: '',
      building: null,
      location_details: '',
      serving: 0,
      description: '',
      mapRegion: defaultMapRegion,      
      mapMarker: null,
    }

    this._showDayPicker = this._showDayPicker.bind(this);
    this._hideDayPicker = this._hideDayPicker.bind(this);
    this._showDateTimePickerEnd = this._showDateTimePickerEnd.bind(this);
    this._hideDateTimePickerEnd = this._hideDateTimePickerEnd.bind(this);
    this._showDateTimePickerStart = this._showDateTimePickerStart.bind(this);
    this._hideDateTimePickerStart = this._hideDateTimePickerStart.bind(this);
    this._handleDayPicked = this._handleDayPicked.bind(this);
    this._handleStartDatePicked = this._handleStartDatePicked.bind(this);
    this._handleEndDatePicked = this._handleEndDatePicked.bind(this);
    this._postEvent = this._postEvent.bind(this);
    this._getImage = this._getImage.bind(this);
    this._postImage = this._postImage.bind(this);
  }

  _showDayPicker = () => this.setState({ isDayPickerVisible: true });

  _hideDayPicker = () => this.setState({ isDayPickerVisible: false });

  _showDateTimePickerStart = () => this.setState({ isDateTimePickerStartVisible: true });

  _hideDateTimePickerStart = () => this.setState({ isDateTimePickerStartVisible: false });

  _showDateTimePickerEnd = () => this.setState({ isDateTimePickerEndVisible: true });

  _hideDateTimePickerEnd = () => this.setState({ isDateTimePickerEndVisible: false });

  _handleDayPicked = (date) => {
    this._hideDayPicker();
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    startDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    endDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.setState({ startDate: startDate });
    this.setState({ endDate: endDate });
  }

  _handleStartDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this._hideDateTimePickerStart();
    let startDate = this.state.startDate;
    startDate.setHours(date.getHours());
    startDate.setMinutes(date.getMinutes());
    this.setState({ startDate: startDate });
    // this.setState({ startDate: date })
  };

  _handleEndDatePicked = (date) => {
    this._hideDateTimePickerEnd();
    let endDate = this.state.endDate;
    endDate.setHours(date.getHours());
    endDate.setMinutes(date.getMinutes());
    this.setState({ endDate: endDate })
  }


  _mapFoodPreferences = () => {

  }

  _handleAddressSearch = async () => {
    // cleanup address input
    let address = this.state.address.trim();
    address = address.replace(/\./g, '');

    // try to find in our building set
    let location = findBuilding(this.state.address);

    if (location == null) {
      // not found, find by geocode
      this.setState({ building: null });
      if (!address.toLowerCase().includes("pittsburgh, pa")){
        address += " Pittsburgh, PA";
      }
      location = await Location.geocodeAsync(address);
      location = location[closest(defaultMapRegion, location)];
    } else {
      // found, get info
      this.setState({ building: location.id });
      this.setState({ address: location.name });
    }
    // set map region and marker
    let region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta      
    }
    this.setState({ mapRegion: region });
    this.setState({ mapMarker: {
      coordinate: {
        latitude: location.latitude,
        longitude: location.longitude},
      key: 'Event'}})
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({ address: "Sennott Square" });
    } else {
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      }
      this.setState({ mapRegion: region });
      // this.setState({ mapMarker: {coordinate: location.coords, key: 'Event'}});
    }
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  componentWillMount() {
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
    });

    fetch(createEventURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json.id;
    })
    .then((eventId) => {
      console.log('POSTing image to event: ' + eventId);
      this._postImage(eventId);
    })
    .catch((error) => {
      console.log('Error: ' + error);
    });
  }

  _getImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    console.log(result);
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  _postImage = (eventId) => {
    if (this.state.image == null) {
      return;
    }

    let imageEndpoint = createEventURL+'/'+eventId+'/images';

    let formData = new FormData();
    formData.append('image', {
      uri: this.state.image,
      name: 'photo.jpeg',
      type: 'image/jpeg'
    });

    fetch(createEventURL+'/'+eventId+'/images', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log('image id: ' + json);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <ScrollView style={styles.viewContainer}>
        {this.state.image == null &&
          <Button
            raised
            icon={{ name: 'camera', size: 18 }}
            containerStyle={{ backgroundColor: 'transparent' }}
            buttonStyle={{ backgroundColor: 'red', borderRadius: 10, marginTop: 10 }}
            textStyle={{ textAlign: 'center' }}
            title={'Add photo'}
            onPress={this._getImage}
          />}

        {this.state.image !== null &&
          <Image source={{ uri: this.state.image }}
            style={{ width: width, height: width }} />}

        <FormLabel labelStyle={styles.textLabel}>Title</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. Best Tacos In Town'}
          maxLength={150}
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
          placeholder={'E.g. 4200 Fifth Ave Pittsburgh, PA or Cathedral'}
          maxLength={100}
          autoCapitalize={'words'}
          onChangeText={(text) => this.setState({ address: text })}
          value={this.state.address}
          returnKeyType="search"
          onSubmitEditing={() => this._handleAddressSearch}          
        />
        <Button
          title={'Find On Map'}
          backgroundColor='#FFC107'
          borderRadius={10}
          containerViewStyle={styles.button}
          color='#607D8B'
          onPress={this._handleAddressSearch}
        />

        <MapView
          style={styles.map}
          region={this.state.mapRegion}
          onRegionChange={this._handleMapRegionChange}>
          {this.state.mapMarker != null &&
            <MapView.Marker
              title={this.state.mapMarker.key}
              key={this.state.mapMarker.key}
              coordinate={this.state.mapMarker.coordinate} />}
        </MapView>

        <FormLabel labelStyle={styles.textLabel}>Location Details</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          placeholder={'E.g. 4th floor, Room 125'}
          maxLength={255}
          onChangeText={(text) => this.setState({ location_details: text })}
        />

        <FormLabel labelStyle={styles.textLabel}>Description</FormLabel>
        <FormInput
          style={styles.textboxLarge}
          multiline={true}
          placeholderTextColor="#bdc6cf"
          placeholder={'E.g. Fish, chicken, bacon, sushi, and tacos! You name it, we got it! '}
          maxLength={500}
          onChangeText={(text) => this.setState({ description: text })}
        />
        <FormLabel labelStyle={styles.textLabel}>Available Servings</FormLabel>
        <FormInput
          inputStyle={styles.textboxNormal}
          keyboardType='number-pad'
          placeholder={'E.g. 25 people'}
          maxLength={3}
          onChangeText={(text) => this.setState({
            serving: text.replace(/[^0-9]/g, '')
          })}
        />

        <DateTimePicker
          isVisible={this.state.isDayPickerVisible}
          mode='date'
          date={this.state.startDate}
          onConfirm={this._handleDayPicked}
          onCancel={this._hideDayPicker}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerStartVisible}
          mode='time'
          date={this.state.startDate}
          onConfirm={this._handleStartDatePicked}
          onCancel={this._hideDateTimePickerStart}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerEndVisible}
          mode='time'
          date={this.state.endDate}
          onConfirm={this._handleEndDatePicked}
          onCancel={this._hideDateTimePickerEnd}
        />

        <FormLabel labelStyle={styles.textLabel}>Date</FormLabel>
        <Button
          title={lib._convertDate_getMonthDay(this.state.startDate)}
          backgroundColor='#FFC107'
          borderRadius={10}
          containerViewStyle={styles.submitButton}
          color='#607D8B'
          onPress={this._showDayPicker}
        />
        <Grid>
          <Col>
            <FormLabel labelStyle={styles.textLabel}>Start Time</FormLabel>
            <Button
              title={lib._convertHoursMin(this.state.startDate)}
              backgroundColor='#FFC107'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              color='#607D8B'
              onPress={this._showDateTimePickerStart}
            />

          </Col>
          <Col>
            <FormLabel labelStyle={styles.textLabel}>End Time</FormLabel>
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
          marginLeft: 10
        }}>
          <CheckBox
            style={{ backgroundColor: '#fff' }}
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
          containerStyle={styles.checkboxContainer}
          />
        </View>

        <Grid>
          <Col>
            <Button
              containerViewStyle={{ padding: 0, margin: 0 }}
              title='CANCEL'
              backgroundColor='#de342f'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              onPress={() => {
                this.props.navigation.goBack(null)
              }} />
          </Col>
          <Col>
            <Button
              containerViewStyle={{ padding: 0, margin: 0 }}
              title='SUBMIT'
              backgroundColor='#009688'
              borderRadius={10}
              containerViewStyle={styles.submitButton}
              onPress={() => {
                this._postEvent();
                this.props.navigation.goBack(null);
              }} />
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
