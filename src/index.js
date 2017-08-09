/* @flow */

import React from 'react';
import { ActivityIndicator, AsyncStorage, Animated, AppState, Alert, AppRegistry, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Button, Col, FormLabel, FormInput, Grid} from 'react-native-elements';
import { TabNavigator, StackNavigator } from 'react-navigation';
// import { Tabs } from './containers/Route'
import { Permissions, Notifications } from 'expo';
import Home from './containers/Home'
import Login from './containers/Login';
import Profile from './containers/Profile';
import Tabs, { TabScreen } from './containers/Route';
import settings from './config/settings';
import images from './config/images';
import metrics from './config/metrics';
import sleep from './lib/sleep';


const TOKEN_ENDPOINT = settings.server.url + '/token';
const SIGNUP_ENDPOINT = settings.server.url + '/signup';
const LOGIN_ENDPOINT = settings.server.url + '/login';
const ACTIVATION_ENDPOINT = settings.server.url + '/users/activate';


async function getToken() {
  const token = await AsyncStorage.getItem('jwt');
  return JSON.parse(token);
}

async function storeToken(token) {
  await AsyncStorage.setItem('jwt', JSON.stringify(token));
}

async function getUser() {
  const user = await AsyncStorage.getItem('user');
  return JSON.parse(user);
}

async function storeUser(userId, activated, admin) {
  const user = JSON.stringify({id: userId, activated: activated, admin: admin});
  await AsyncStorage.setItem('user', user);
}

async function activateUser() {
  const activated = JSON.stringify({activated: true});
  await AsyncStorage.mergeItem('user', activated);
}

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
  getUser()
  .then((user) => {
    return fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        user: user.id,
      }),
    });

    console.log('Token: ' + token);
  });
}

// async function registerForPushNotifications() {
//   console.log('check existing status');
//   const { existingStatus } = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
//   let finalStatus = existingStatus;

//   // prompt for permission if not determined
//   console.log('not granted');  
//   if (existingStatus !== 'granted') {
//     const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
//     finalStatus = status;
//   }

//   // stop here if permission not granted
//   console.log('stop');  
//   if (finalStatus !== 'granted') {
//     return;
//   }

//   // get token
//   console.log('get token');  
//   let token = await Notifications.getExponentPushTokenAsync();

//   // POST token to server
//   console.log('post to server');  
//   return fetch(TOKEN_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       token: token,
//       user: await getUser().id,
//     }),
//   });

//   console.log('Token: ' + token);
// }

function fetchToken(email, password) {
  fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
  .then((response) => response.json())
  .then((responseData) => {
    storeToken({token: responseData['token'], expires: responseData['expires']});
  });
}

class AppScreen extends React.Component {
  render() {
    return(
      <View>
        <Button
          title="TEST"
          onPress={() => { console.log(this.props); this.props.navigation.navigate('Enter'); }}
        />
      </View>
    );
  };
}

class SignupScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      alreadyExists: false,
      email: '',
      password: '',
      confirmPassword: '',
      incorrectPassword: false,
    }
  }

  signup() {
    if (this.state.email !== '' && this.state.password !== '') {
      let activated = false;
      fetch(SIGNUP_ENDPOINT, {
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
        if (responseData.status !== undefined && responseData.status == 400) {
          const message = responseData['message'];
          console.log(message);
          if (message.startsWith('User already exists')) {
            this.setState({ alreadyExists: true });
          }
        } else {
          console.log(responseData);
          this.setState({ alreadyExists: false });
          const userId = responseData['id'];
          const admin = responseData['admin'];
          activated = responseData['active'];
          global.admin = admin;          
          storeUser(userId, activated, admin)
          .then(() => {
            fetchToken(this.state.email, this.state.password);
          });
        }
      })
      .then(() => {
        this.setState({ loading: false });
        if (activated) {
          this.props.navigation.navigate('Home');
          registerForPushNotifications();
        } else if (!this.state.alreadyExists) {
          this.props.navigation.navigate('Activation');
        }
      })
      .catch((error) => {
        console.log(error);        
        if (error['message'].startsWith('User already exists with email')) {
          this.setState({alreadyExists: true});
        }
      })
      .done(() => {
        this.setState({ loading: false });
      });
    }
  }

  render() {
    return(
      <View
        style={{flex: 1}}>
          <Image
            source={images.enter}
            style={{flex: 1, width: metrics.width, height: metrics.height, resizeMode: 'cover'}}>
            {this.props.children}
            <View>
              <TextInput
                style={styles.input}
                marginTop={300}
                marginLeft={60}
                placeholder = "Pitt Email Address"
                placeholderTextColor = '#333'
                inputStyle={{fontSize: 20}}
                returnKeyType = "next"
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(text) => this.setState({ 'email': text })}
                value={this.state.email} />
              <TextInput
                style={styles.input}
                marginLeft={60}
                secureTextEntry
                placeholder = "Pick a Secure Password"
                placeholderTextColor = '#333'
                inputStyle={{fontSize: 20}}
                returnKeyType = "next"
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(text) => this.setState({ 'password': text })}
                value={this.state.password} />
              {!this.state.loading &&
              <Grid>
                <Col style={{height: 0}}>
                  <Button
                    title="BACK"
                    large
                    raised
                    fontSize={20}
                    color='#333333'
                    height={80}
                    backgroundColor='rgb(247, 229, 59)'
                    onPress={() => this.props.navigation.goBack(null)}
                    style={{width: 150, height: 80, alignItems: 'center'}} />
                </Col>
                <Col style={{height: 0}}>
                  <Button
                    title="ENTER"
                    large
                    raised
                    fontSize={20}
                    color='#333333'
                    backgroundColor='rgb(247, 229, 59)'
                    onPress={() => {
                      this.setState({ loading: true });
                      this.signup();
                    }}
                    style={{width: 150, height: 80, alignItems: 'center'}} />
                </Col>
               </Grid>}
                {this.state.loading &&
                  <ActivityIndicator
                    color='#fff'
                    marginTop={300} />
                }
            </View>
              {this.state.alreadyExists && 
                <View>
                  <Text fontSize={18} color='purple' backgroundColor='rgba(0,0,0,0)' marginTop={200} >Email already in use</Text>
                </View>
              }
          </Image>
      </View>
    );
  };
}

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: false
    }
  }

  login() {
    if (this.state.email !== '' && this.state.password !== '') {
      let activated = false;
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
        if (responseData.status !== undefined && responseData.status >= 400) {
          const message = responseData['message'];
          console.log(message);
        } else {
          console.log('in login');
          console.log(responseData);
          this.setState({ loading: false });
          activated = responseData['user']['active'];
          storeToken({token: responseData['token'], expires: responseData['expires']});
          storeUser(responseData['user']['id'], activated, responseData['user']['admin']);
          global.admin = responseData['user']['admin'];
        }
      })
      .then(() => {
        if (activated) {
          this.props.navigation.navigate('Home');
          registerForPushNotifications();
        } else {
          this.props.navigation.navigate('Activation');
        }
      })
      .catch((error) => {
        console.log('error loggin in');
      })
      .done(() => {
        this.setState({ loading: false });
      })
    }
  }

  render() {
    return(
      <View
        style={{flex: 1}}>
          <Image
            source={images.enter}
            style={{flex: 1, width: metrics.width, height: metrics.height, resizeMode: 'cover'}}>
            {this.props.children}
            <TextInput
              style={styles.input}
              marginTop={300}
              marginLeft={60}
              placeholder = "Email"
              placeholderTextColor = '#444'
              inputStyle={{fontSize: 20}}
              returnKeyType = "next"
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(text) => this.setState({ 'email': text })}
              value={this.state.email} />
            <TextInput
                style={styles.input}
                marginLeft={60}
                placeholder = "Password"
                secureTextEntry
                placeholderTextColor = '#444'
                inputStyle={{fontSize: 20}}
                returnKeyType = "go"
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(text) => this.setState({ 'password': text })}
                value={this.state.password} />
              {!this.state.loading &&
              <Grid>
                <Col style={{height: 0}}>
                  <Button
                    title="BACK"
                    large
                    raised
                    fontSize={20}
                    color='#333333'
                    height={80}
                    backgroundColor='rgb(247, 229, 59)'
                    onPress={() => this.props.navigation.goBack(null)}
                    style={{width: 150, height: 80, alignItems: 'center'}} />
                </Col>
                <Col style={{height: 0}}>
                  <Button
                    title="ENTER"
                    large
                    raised
                    fontSize={20}
                    color='#333333'
                    backgroundColor='rgb(247, 229, 59)'
                    onPress={() => {
                      this.setState({ loading: true });
                      this.login();
                    }}
                    style={{width: 150, height: 80, alignItems: 'center'}} />
                </Col>
               </Grid>}
              {this.state.loading &&
                <ActivityIndicator
                  color='#fff' />
              }

              {/*!this.state.loading &&
                <Button
                  title="ENTER"
                  raised
                  fontSize={18}
                  color='#333333'
                  backgroundColor='rgb(247, 229, 59)'
                  containerStyle={{backgroundColor: 'rgb(247, 229, 59)'}}
                  onPress={() => {
                    if (this.state.email !== '' && this.state.password !== '') {
                      this.setState({ loading: true });
                    }
                  }}
                  style={{height: null, width: 10, alignItems: 'center'}} />
              }
              {this.state.loading &&
                <ActivityIndicator 
                  color='#fff'
                />
              */}
          </Image>        
      </View>
    );
  };
}

class ActivationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      activationCode: ''
    };
  }

  activateUser() {
    fetch(ACTIVATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activation: this.state.activationCode,
        }),
      })
      .then((response) => {
        if (response.ok) {
          activateUser();
          console.log('user successfully activated');
          this.props.navigation.navigate('Home');
          registerForPushNotifications();
        }
      })
      .catch((error) => {
        console.log('failed activation');
      })
      .done(() => {
        this.setState({ loading: false })
      });
  }

  render() {
    return(
      <View
        style={{flex: 1}}>
          <Image
            source={images.enter}
            style={{flexGrow: 1, width: metrics.width, height: metrics.height, resizeMode: 'cover', alignContent: 'center', alignItems: 'center'}}>
            {this.props.children}
          <TextInput
            style={styles.input}
            marginTop={300}
            marginLeft={60}
            placeholder="Enter emailed verification"
            maxLength={6}
            placeholderTextColor = '#333'
            inputStyle={{fontSize: 20}}
            returnKeyType = "go"
            autoCapitalize='characters'
            onChangeText={(text) => {
              this.setState({ activationCode: text })
            }}
            value={this.state.activationCode}
          />
          <Text height={0}>{'\n'}</Text>
          {!this.state.loading &&          
            <Grid>
              <Col style={{height: 0}}>
                <Button
                  title="RESEND"
                  large
                  raised
                  fontSize={20}
                  color='#333333'
                  backgroundColor='rgb(247, 229, 59)'
                  onPress={() => this.props.navigation.goBack(null)}
                  style={{width: 150, height: 80, alignItems: 'center'}} />
              </Col>
              <Col style={{height: 0}}>
                <Button
                  title="ENTER"
                  large
                  raised
                  fontSize={20}
                  color='#333333'
                  backgroundColor='rgb(247, 229, 59)'
                  onPress={() => {
                    if (this.state.activationCode !== '' && this.state.activationCode.length == 6) {
                      this.setState({ loading: true });
                      this.activateUser();
                    }
                  }}
                  style={{width: 150, height: 80, alignItems: 'center'}} />
              </Col>
            </Grid>}
          {this.state.loading &&
            <ActivityIndicator color='#fff' />
          }
        </Image>
      </View>
    );
  }
}

class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activationCode: ''
    }
  }
  render() {
    getUser()
    .then((user) => {
      if (user !== null && user !== undefined) {
        if (user.activated) {
          getToken()
          .then((token) => {
            if (token !== null && token !== undefined) {
              console.log('navigate to home');
              this.props.navigation.navigate('Home');
            }
          })
        } else if (user.activated !== null && user.activated !== undefined) {
          console.log('navigate to activation');
          console.log(user);
          this.props.navigation.navigate('Activation');
        }
      }
    });
    // must log in or sign up
      return(
        <View
          style={{flex: 1}}>
          <Image
            source={images.enter}
            style={{flex: 1, width: metrics.width, height: metrics.height, resizeMode: 'cover'}}>
            <Grid>
              <Col style={{marginTop: 400, height: 0}}>
                <Button
                  title="SIGN UP"
                  large
                  raised
                  fontSize={20}
                  color='#333333'
                  height={80}
                  backgroundColor='rgb(247, 229, 59)'
                  onPress={() => this.props.navigation.navigate('Signup')}
                  style={{width: 150, height: 80, alignItems: 'center'}} />
              </Col>
              <Col style={{marginTop: 400, paddingHorizontal: 10, height: 0}}>
                <Button
                  title="LOG IN"
                  large
                  raised
                  fontSize={20}
                  color='#333333'
                  backgroundColor='rgb(247, 229, 59)'
                  onPress={() => this.props.navigation.navigate('Login')}
                  style={{width: 150, height: 80, alignItems: 'center'}} />
              </Col>
            </Grid>
            </Image>
        </View> 
      );
  };
}

const AppNav = StackNavigator({
  Welcome: { 
    screen: WelcomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Enter',
    }),
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Signup'
    }),
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Login'
    }),
  },
  Activation: {
    screen: ActivationScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Activation'
    }),
  },
  Home: {
    screen: TabScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Home'
    }),
  },
}, {
  mode: 'card',
  headerMode: 'none',
  transitionConfig: () => {
    transitionSpec: {
      duration: 0
      timing: Animated.timing
    }
  }
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      notification: {},
    };
  };

  static navigationOptions = {
    title: 'Welcome',
  };

  componentWillMount() {
    sleep(3000);
    this.setState({ isReady: true, appState: 'active'});
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    storeToken(null);
    storeUser(null);
  }

  componentDidMount() {
    AppState.addEventListener('change', state => {
      this.setState({ appState: state });
      console.log('AppState is ', state);
    });
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
    if (this.state.appState == 'active') {
      Alert.alert(
          'New event: ' + notification.title,
          'body: ' + notification.body + '  data: ' + notification.data,
          {text: 'OK'});
        // Notifications.scheduleLocalNotificationAsync(this.state.notification, {time: Date().getTime()+5000});
    } else {
      Notifications.presentLocalNotificationAsync(this.state.notification);
    }
    // Notifications.getBadgeNumberAsync()
    //   .then((badgeCount) => 
    //     Notifications.setBadgeNumberAsync(badgeCount+1));
  }

  render() {
    // const { navigate } = this.props.navigation;
    return(<AppNav />);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(204, 204, 204, 0.6)',
    paddingHorizontal : 10,
    color:'#333333',
    marginBottom : 10,
    marginRight: 60,
    marginLeft: 40,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20
  }
});

AppRegistry.registerComponent("main", () => App);
