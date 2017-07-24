import React from 'react';
import { StyleSheet, Text, TextInput, View, StatusBar, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { FormLabel, FormInput, CheckBox, Button, Grid, Col, Slider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'
import { Tabs } from '../containers/Route'
import settings from '../config/settings';

const LOGIN_ENDPOINT = 'http://' + settings.server.url + '/login';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.login = this.login.bind(this);
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
      .catch((error) => {
        console.log('failed login');
      }).done(() => {
        console.log('global user id is: ' + global.user_id);
        console.log('navigating to tabs');
      });
    }
  }

  render() {
    return(
      <KeyboardAvoidingView behavior = "padding" style={styles.container}>
      <StatusBar barStyle = 'dark-content' />
      <Grid style={{
        flex: 0,
        paddingTop: 200}}>
        <TextInput
          style={styles.input}
          placeholder='Email'            
          inputStyle={{color: '#607D8B', fontSize: 15}}
          returnKeyType="next"
          keyboardType='email-address'
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={(text) => this.setState({ email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder = "Password"
          secureTextEntry
          inputStyle={{color: '#607D8B', fontSize: 15}}
          returnKeyType = "go"
          onChangeText={(text) => this.setState({ password: text })}>
        </TextInput>
      </Grid>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          this.login();
          const nav = NavigationActions.navigate({
            routeName: 'Login',
            params: {},
            action: NavigationActions.navigate({routeName: 'Tabs'})
          })
          /* this.props.navigation.navigate('Home', {
            onNavigationStateChange: (prevState, newState) => {
              this.setState({...this.state, route_index: newState.index})},
            screenProps: this.state,
          }); */
          this.props.navigation.dispatch(nav);
        }}>
        <Text style = {styles.loginbutton}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
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