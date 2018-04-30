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
  StyleSheet
} from 'react-native'
import { Button, CheckBox, FormLabel, FormInput, Slider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
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
import { postSettings } from '../lib/api';

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  submitButton: {
    paddingTop: 10,
    paddingBottom: 20
  },
  viewContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
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

const LOGIN_ENDPOINT = settings.server.url + '/login';
const TOKEN_ENDPOINT = settings.server.url + '/token';
const PREFERENCES_ENDPOINT = settings.server.url + '/users/preferences';
const FEEDBACK_LINK = 'pittgrub.org';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      glutenFree: false,
      dairyFree: false,
      vegetarian: false,
      vegan: false,
      eagerness: 1,
      maxEager: 5,
      pantry: false
    }

    this.getPreferences();

  }

  testnav = () => {
    console.log('in profile');
  }

  componentWillMount() {
    getUser()
      .then((user) => {
        // set pitt pantry setting
        if (user['pantry'] == undefined || user['pantry'] == null) {
          setPantry(false);
          this.setState({ pantry: false });
        } else {
          this.setState({ pantry: user['pantry'] })
        }

        // set eagerness level
        if (user['eagerness'] == undefined || user['eagerness'] == null) {
          setEagerness(3);
          this.setState({ eagerness: 3 });
        } else {
          this.setState({ eagerness: user['eagerness'] });
        }
      });
  }

  componentWillReceiveProps(newProps) {
    console.log("Route index: " + newProps.screenProps.route_index);
    if (newProps.screenProps.route_index === 2) {
      this.testnav();
    }
  }

  async updatePreferences() {
    var preferences = [];
    if (this.state.glutenFree) {
      preferences.push(1);
    }
    if (this.state.dairyFree) {
      preferences.push(2);
    }
    if (this.state.vegetarian) {
      preferences.push(3);
    }
    if (this.state.vegan) {
      preferences.push(4);
    }
    let token = await getToken();
    fetch(PREFERENCES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.token
      },
      body: JSON.stringify(preferences)
    })
      .then((response) => {
        if (response.ok) {
          setFoodPreferences(preferences);
          console.log('response');
          return response.json();
        } else {
          console.log('response failed');
          console.log(response);
        }
      })
      .then((responseData) => {
        console.log('responseData');
        console.log(responseData);
      })
      .catch((error) => {
        console.log('Error: ' + error);
      });
  }

  getPreferences() {
    // AsyncStorage.getItem('user')
    //   .then((user) => {
    //     user = JSON.parse(user);
    //     let foodPrefs = user.food_preferences;
    //     if (foodPrefs.includes(1)) {
    //       this.setState({ glutenFree: true });
    //     }
    //     if (foodPrefs.includes(2)) {
    //       this.setState({ dairyFree: true });
    //     }
    //     if (foodPrefs.includes(3)) {
    //       this.setState({ vegetarian: true });
    //     }
    //     if (foodPrefs.includes(4)) {
    //       this.setState({ vegan: true });
    //     }
    //   });
  }

  render() {
    return (
      <ScrollView style={styles.viewContainer}>
        {/* Food preference settings */}
        <FormLabel labelStyle={styles.title}>Food Preferences</FormLabel>
        <Text
          style={{ fontSize: 15, margin: 5, marginLeft: 20, marginRight: 20 }}>
          We will only send notifications for food events that match your preferences.
        </Text>
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

        <CheckBox
          title='Vegan'
          checked={this.state.vegan}
          onPress={() => {
            this.setState({ vegan: !this.state.vegan })
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
        />
        <Button
          title='UPDATE'
          backgroundColor='#009688'
          borderRadius={10}
          containerViewStyle={styles.submitButton}
          onPress={() => {
            this.updatePreferences();
          }}
        />

        <FormLabel labelStyle={styles.title}>Eagerness</FormLabel>
        <Text
          style={{ fontSize: 15, margin: 5, marginLeft: 20, marginRight: 20, }}>
          How eager are you to pursue free food? This will influence your likelihood of being sent event notifications.
        </Text>
        {/* <Text style={{ fontSize: 15, margin: 5, marginLeft: 20, marginRight: 20 }}>
          Max notifications: <Text style={{ fontWeight: 'bold' }}>{this.state.maxNotifications}</Text>
        </Text> */}
        <Slider
          style={{ marginLeft: 20, marginRight: 20 }}
          thumbTintColor={'#009688'}
          value={this.state.eagerness}
          minimumValue={1}
          maximumValue={5}
          step={1}
          onSlidingComplete={() => {
            console.log("done: " + this.state.eagerness);
            setEagerness(this.state.eagerness);
            postSettings({ eagerness: this.state.eagerness })
          }}
          onValueChange={(value) => this.setState({ eagerness: value })}/>

        <FormLabel labelStyle={styles.title}>Pitt Pantry</FormLabel>
        <Text style={{fontSize:15, margin:5, marginLeft:20, marginRight:20}}>
          Check this box if you are a member of The Pitt Pantry. This will increase your likelihood of being sent event notifications. We do not share this information.
        </Text>
        <CheckBox
          title='Member'
          checked={this.state.pantry}
          onPress={() => {
            let newStatus = !this.state.pantry;
            setPantry(newStatus);
            postSettings({ pantry: newStatus });
            this.setState({ pantry: newStatus });
          }}
          containerStyle={styles.checkboxContainer}
          checkedColor='#009688'
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

export default Profile;
