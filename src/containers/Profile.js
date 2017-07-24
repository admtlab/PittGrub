import React from 'react'
import {
  Alert,
  Switch,
  ScrollView,
  Text,
  Image,
  View,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  StyleSheet } from 'react-native'
import { Button, CheckBox, FormLabel, FormInput } from 'react-native-elements';
import { Permissions, Notifications } from 'expo';
import metrics from '../config/metrics'
import colors from '../config/styles'
import images from '../config/images'
import settings from '../config/settings';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';

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

async function registerForPushNotifications() {
  console.log('check existing status');
  const { existingStatus } = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
  let finalStatus = existingStatus;

  // prompt for permission if not determined
  console.log('not granted');  
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
    finalStatus = status;
  }

  // stop here if permission not granted
  console.log('stop');
  console.log('status: ' + finalStatus);
  if (finalStatus !== 'granted') {
    return;
  }

  // get token
  console.log('get token');  
  let token = await Notifications.getExponentPushTokenAsync();

  // POST token to server
  console.log('post to server');  
  return fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      user: global.user_id,
    }),
  });

  console.log('Token: ' + token);
}

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
  }

  testnav = () => {
    console.log('in profile');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index === 2) {
      this.testnav();
    }
  }

  login() {
    if (this.state.email !== '' && this.state.password !== '') {
      fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      })
      .then((response) => response.json())
      .then((responseData) => {
        global.user_id = responseData['user'];
      })
      .then(() => {
        console.log('global user id is: ' + global.user_id);
        // Alert.alert(
        //   'Success',
        //   'Logged in as id: ' + global.user_id,
        //   {text: 'OK'});
        console.log('registering for push notifications');
        registerForPushNotifications();
      })
      .catch((error) => {
        console.log('failed login');
      }).done(() =>{
      });
    }
  }

  render() {
    return (
      <ScrollView style={styles.viewContainer}>
        {/* Login config */}
        <FormLabel labelStyle={styles.title}>Login</FormLabel>
        <TextInput
          style={styles.input}
          placeholder='Email'
          inputStyle={{ color: '#607D8B', fontSize: 15 }}
          returnKeyType="next"
          keyboardType='email-address'
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(text) => this.setState({ email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          inputStyle={{ color: '#607D8B', fontSize: 15 }}
          returnKeyType="go"
          onChangeText={(text) => this.setState({ password: text })}>
        </TextInput>
        <Button
          title='LOGIN'
          backgroundColor='#009688'
          borderRadius={10}
          containerViewStyle={styles.submitButton}
          onPress={() => {
            this.login();
          }}
        />

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
            null
          }}
        />
      </ScrollView>
    );
  }
}

export default Profile;
