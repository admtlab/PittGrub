import React from 'react'
import {
  Alert,
  AsyncStorage,
  Switch,
  ScrollView,
  Text,
  Linking,
  WebView,
  Image,
  View,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  StyleSheet } from 'react-native'
import { Button, CheckBox, FormLabel, FormInput } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { Permissions, Notifications } from 'expo';
import metrics from '../config/metrics'
import colors from '../config/styles'
import images from '../config/images'
import settings from '../config/settings';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';
import { setFoodPreferences } from '../lib/user';
import { getToken } from '../lib/auth';

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
  input:{
    minWidth:300,
    flexWrap:'wrap',
    height : 40,
    backgroundColor: 'rgba(204,204,204,0.2)',
    paddingHorizontal : 10,
    color:'#333333',
    marginBottom : 10,
  },
  buttonContainer:{
    backgroundColor: "#1980b9",
    paddingVertical:10,
    marginTop:15,
    marginBottom:20
  },
  loginbutton:{
    color: '#ffffff',
    textAlign:'center',
    fontWeight:'700'
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
    }

    this.getPreferences();

  }

  testnav = () => {
    console.log('in profile');
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
    AsyncStorage.getItem('user')
    .then((user) => {
      user = JSON.parse(user);
      let foodPrefs = user.food_preferences;
      if (foodPrefs.includes(1)) {
        this.setState({ glutenFree: true });
      }
      if (foodPrefs.includes(2)) {
        this.setState({ dairyFree: true });
      }
      if (foodPrefs.includes(3)) {
        this.setState({ vegetarian: true });
      }
      if (foodPrefs.includes(4)) {
        this.setState({ vegan: true });
      }
    });
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

        {/*<View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderColor: '#ededed',
          backgroundColor: '#f9f9f9',
          borderWidth: 1,
          padding: 10,
          borderRadius: 3,
          margin: 5,
          marginRight: 10,
          marginLeft: 10
        }}>
          <CheckBox
            style={{ backgroundColor: '#f9f9f9' }}
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
          />
          <TouchableHighlight
            style={{
              flex: 1,
              alignContent: 'center',
              marginTop: -4,
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}>
            <Image
              resizeMode='center'
              source={images.info}
            />
          </TouchableHighlight>
        </View>*/}
        {/*<FormLabel labelStyle={styles.title}>Change Password</FormLabel>
        <FormLabel>Old Password</FormLabel>
        <FormInput secureTextEntry={true}/>
        <FormLabel>New Password</FormLabel>        
        <FormInput secureTextEntry={true}/>
        <FormLabel>Confirm New Password</FormLabel>
        <FormInput secureTextEntry={true}/>*/}

        <Button
          title='UPDATE'
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
            AsyncStorage.removeItem('jwt');
            AsyncStorage.removeItem('user');
            // key must be null to go back to inital page and clear path
            // see https://github.com/react-community/react-navigation/issues/1127#issuecomment-295841343
            this.props.navigation.dispatch(NavigationActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({routeName: 'Entrance'})
              ]
            }))
          }}
        />
      </ScrollView>
    );
  }
}

export default Profile;
