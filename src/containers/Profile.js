import React from 'react'
import {
  Alert,
  AsyncStorage,
  Switch,
  ScrollView,
  Text,
  WebView,
  Image,
  View,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from 'react-native'
import { Button, CheckBox, FormLabel, FormInput, Slider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { inject, observer } from 'mobx-react';
import { Permissions, Notifications } from 'expo';
import metrics from '../config/metrics'
import colors from '../config/styles'
import images from '../config/images'
import settings from '../config/settings';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';
import {
  setEagerness,
  setFoodPreferences,
  setPantry
} from '../lib/user';
import { getToken, getUser, clearAll } from '../lib/auth';
import { postProfile } from '../lib/api';

const FEEDBACK_LINK = 'pittgrub.org';

@inject("userStore", "tokenStore")
@observer
class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    }

    this.updatePreferences = this.updatePreferences.bind(this);
  }

  updatePreferences = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    postProfile(tokenStore.accessToken, userStore.foodPreferences, userStore.pantry)
    .then(response => {
      if (!response.ok) { throw response}
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    const userStore = this.props.userStore;
    return (
      <ScrollView style={styles.viewContainer}>

        <FormLabel labelStyle={styles.title}>Pitt Pantry</FormLabel>
        <Text style={styles.descriptionText}>
          Check this box if you are a member of The Pitt Pantry. This will increase your likelihood of being sent event notifications. This information is kept confidential.
        </Text>
        <CheckBox
          title='Member'
          checked={userStore.pantry}
          onPress={() => userStore.togglePantry()}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        {/* Food preference settings */}
        <FormLabel labelStyle={styles.title}>Food Preferences</FormLabel>
        <Text
          style={styles.descriptionText}>
          We will only send notifications for food events that match your preferences.
        </Text>
        <CheckBox
          title='Gluten Free'
          checked={userStore.foodPreferences.some(f => f === 1)}
          onPress={() => {
            userStore.toggleFoodPreference(1);
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        <CheckBox
          title='Dairy Free'
          checked={userStore.foodPreferences.some(f => f === 2)}
          onPress={() => {
            userStore.toggleFoodPreference(2);          
          }}
          checkedColor='#009688'
          containerStyle={styles.checkboxContainer}
        />

        <CheckBox
          title='Vegetarian'
          checked={userStore.foodPreferences.some(f => f === 3)}
          onPress={() => {
            userStore.toggleFoodPreference(3);          
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        <CheckBox
          title='Vegan'
          checked={userStore.foodPreferences.some(f => f === 4)}
          onPress={() => {
            userStore.toggleFoodPreference(4);
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />

        {/*
        <FormLabel labelStyle={styles.title}>Status</FormLabel>
        <Text style={styles.descriptionText}>
        By letting us know of your status at Pitt, we can better tailor your experience.
        </Text>
        <Picker selectedValue={'student'} >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Faculty" value="faculty" />
          <Picker.Item label="Staff" value="staff" />
        </Picker>
        */}

        <Button
          title='SAVE'
          backgroundColor='#009688'
          borderRadius={10}
          containerViewStyle={styles.submitButton}
          onPress={() => {
            this.updatePreferences();
          }}
        />

        <FormLabel labelStyle={styles.title}>Account</FormLabel>
        <Button
          title='LOG OUT'
          backgroundColor='rgba(231,76,60,1)'
          borderRadius={10}
          containerViewStyle={styles.submitButton}
          onPress={() => {
            console.log('Logging out');
            clearAll();
            // key must be null to go back to inital page and clear path
            // see https://github.com/react-community/react-navigation/issues/1127#issuecomment-295841343
            this.props.navigation.dispatch(NavigationActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({ routeName: 'Entrance' })
              ]
            }))
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 15,
    margin: 5,
    marginLeft: 20,
    marginRight: 20
  },
  submitButton: {
    paddingTop: 10,
    paddingBottom: 20
  },
  viewContainer: {
    backgroundColor: '#fff',
    width: metrics.screenWidth,
    height: metrics.screenHeight - metrics.tabBarHeight,
    zIndex: 100
  },
  container: {
    padding: 20,
  },
  input: {
    minWidth: 300,
    flexWrap: 'wrap',
    height: 40,
    backgroundColor: 'rgba(204,204,204,0.2)',
    paddingHorizontal: 10,
    color: '#333333',
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: "#1980b9",
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 20
  },
  loginbutton: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700'
  }
});

export default Profile;
