/* @flow */

import React from 'react';
import { ActivityIndicator, Animated, AppState, Alert, AppRegistry, Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
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


const TOKEN_ENDPOINT = settings.server.url + '/users/token';
const SIGNUP_ENDPOINT = settings.server.url + '/signup';
const LOGIN_ENDPOINT = settings.server.url + '/login';
const ACTIVATION_ENDPOINT = settings.server.url + '/users/activate';


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
      email: '',
      password: '',
      confirmPassword: '',
      incorrectPassword: false,
    }
  }

  signup() {
    if (this.state.email !== '' && this.state.password !== '') {
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
        console.log(responseData);
        global.user_id = responseData['id'];
        global.activated = responseData['active'];
        console.log('user_id: ' + global.user_id);
        console.log('activated: ' + global.activated);
      })
      .then(() => {
        this.setState({ loading: false });
        if (global.activated) {
          this.props.navigation.navigate('Home');
        } else {
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
                placeholder = "Enter a New Password"
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
                      this.signup()
                    }}
                    style={{width: 150, height: 80, alignItems: 'center'}} />
                </Col>
               </Grid>}
                {this.state.loading &&
                  <ActivityIndicator
                    color='#fff' />
                }
            </View>
              {this.state.alreadyExists && 
                <Text fontSize={18} color='purple'>Email already in use</Text>
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
        console.log(responseData);
        this.setState({ loading: false });
        global.jwt = responseData['token'];
        global.jwt_expires = responseData['expires'];
        global.user_id = responseData['user']['id'];
        global.activated = responseData['user']['active'];
        if (!responseData['active']) {
          this.props.navigation.navigate('Activation');
        } else {
          this.props.navigation.navigate('Home');
        }
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
      .then(() => {
        global.activated = true;
        console.log('user successfully activated');
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        console.log('failed activation');
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
          <Button
            title="ENTER"
            raised
            fontSize={18}
            color='#333333'
            height={10}
            paddingHorizontal={0}
            backgroundColor='rgb(247, 229, 59)'
            containerStyle={{backgroundColor: 'rgb(247, 229, 59)'}}
            onPress={() => {
              if (this.state.activationCode !== '' && this.state.activationCode.length == 6) {
                this.activateUser()
              }
            }}
            style={{alignItems: 'center'}} />
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
    if (global.user_id !== undefined && global.activated == false) {
      // must activate
      this.props.navigation.navigate('Activation');
    } else if (global.user_id !== undefined && global.activated && global.jwt !== undefined) {
      this.props.navigation.navigate('Home');
    }
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
  mode: 'modal',
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
    return(
      <AppNav />
    );
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
