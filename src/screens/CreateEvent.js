import { Button } from '../components/Button';
import { colors } from '../config/styles';
import { parseDayMonth } from '../lib/time';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { FormInput, FormLabel } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';


const { width } = Dimensions.get('screen');


@inject('eventStore', 'tokenStore')
@observer
export default class CreateEvent extends Component {
  state = {
    dayPickerVisible: false,
    image: null,
    title: '',
    organization: '',
    address: '',
    location: '',
    text: '',
    servings: null,
    startDate: new Date(),
    endDate: new Date(),
  };

  getImage = () => {
    console.log('...getting image');
  }

  showDayPicker = () => {
    console.log('showing');
    this.setState({ dayPickerVisible: true })
  };

  setTitle = (title) => this.setState({ title });

  setDescription = (description) => this.setState({ description });

  setOrganization = (organization) => this.setState({ organization });

  setAddress = (address) => this.setState({ address });

  setLocation = (location) => this.setState({ location });

  setServings = (servings) => this.setState({ servings });

  render() {
    return (
      <ScrollView width={width}>
        {this.state.image ? (
          <Image source={{ uri: this.state.image }} style={{ width, height: width }} />
        ) : (
          <View width={width} alignItems='center'>
            <Button
              title='Add photo'
              icon={{ name: 'camera', size: 18, color: colors.softWhite }}
              onPress={this.getImage}
              buttonStyle={{ backgroundColor: colors.red }}
              textStyle={{ color: colors.softWhite }}
              containerStyle={{ backgroundColor: 'transparent' }}
            />
          </View>
        )}

        <FormLabel labelStyle={styles.label}>Title</FormLabel>
        <FormInput
          placeholder='E.g., "Best Tacos in Town"'
          maxLength={150}
          onChangeText={this.setTitle}
          inputStyle={styles.input}
        />

        <FormLabel labelStyle={styles.label}>Description</FormLabel>
        <FormInput
          placeholder='E.g., Chicken, bacon, sushi, salad, and tacos! You name it, we got it!'
          maxLength={500}
          onChangeText={this.setDescription}
          multiline
          style={styles.inputLarge}
          inputStyle={styles.input}
        />

        <FormLabel labelStyle={styles.label}>Organization</FormLabel>
        <FormInput
          placeholder='E.g., University of Pittsburgh'
          maxLength={20}
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
        />

        <FormLabel labelStyle={styles.label}>Available Servings</FormLabel>
        <FormInput
          placeholder='E.g., 25 people'
          maxLength={3}
          onChangeText={this.setServings}
          keyboardType='number-pad'
          inputStyle={styles.input}
        />

        <DateTimePicker
          isVisible={this.state.dayPickerVisible}
          mode='date'
          date={this.state.startDate}
          onConfirm={console.log}
          onCancel={console.log}
        />

        <FormLabel labelStyle={styles.textLabel}>Date</FormLabel>
        <Button
          title={parseDayMonth(this.state.startDate)}
          onPress={this._showDayPicker}
          borderRadius={10}
          backgroundColor='#FFC107'
          color='#607D8B'
          containerViewStyle={styles.submit}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: colors.darkGrey,
  },
  input: {
    fontSize: 16,
    color: '#607D8B',
    marginHorizontal: 10,
  },
  inputLarge: {
    fontSize: 16,
    height: 50,
    color: '#607D8B',
    marginHorizontal: 10
  }
});
