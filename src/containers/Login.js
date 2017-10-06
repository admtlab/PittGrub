import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Button, Col, Grid } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import settings from '../config/settings';
import { postLogin } from '../lib/api';
import { storeToken, storeUser } from '../lib/auth';
import { registerForPushNotifications } from '../lib/notifications';


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
      correctCredentials: false,
    }

    this._login = this._login.bind(this);
  }

  _login = async () => {
    if (this.state.email !== '' && this.state.password !== '') {
      let activated = false;
      let status = '';
      postLogin(this.state.email, this.state.password)
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status !== undefined && responseData.status >= 400) {
            console.log('printing message')
            const message = responseData['message'];
            console.log(message);
          } else {
            console.log(responseData);
            this.setState({ loading: false });
            activated = responseData['user']['active'];
            status = responseData['user']['status'];
            console.log('storing token');
            storeToken({ token: responseData['token'], expires: responseData['expires'] });
            console.log('storing user');
            storeUser(responseData['user']);
            console.log('setting global');
            global.admin = responseData['user']['admin'];
            if (!activated) {
              console.log('not activated');
              registerForPushNotifications();
              this.props.navigation.navigate('Verification');
            } else if (status !== "ACCEPTED") {
              console.log('near waiting');
              this.props.navigation.navigate('Waiting');
            } else {
              console.log('near home');
              this.props.navigation.navigate('Home');
            }
          }
        })
        .catch((error) => {
          console.log('error loggin ing');
          console.log(error);
        })
        .done(() => {
          this.setState({ loading: false });
        });
    }
  }

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#333333' }}>
        {this.props.children}
        <TextInput
          style={styles.input}
          marginTop={300}
          marginLeft={60}
          placeholder="Email"
          placeholderTextColor='#444'
          inputStyle={{ fontSize: 20 }}
          returnKeyType="next"
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) => this.setState({ 'email': text })}
          value={this.state.email} />
        <TextInput
          style={styles.input}
          marginLeft={60}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor='#444'
          inputStyle={{ fontSize: 20 }}
          returnKeyType="go"
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(text) => this.setState({ 'password': text })}
          value={this.state.password} />
        {!this.state.loading &&
          <Grid>
            <Col style={{ height: 0 }}>
              <Button
                title="BACK"
                large
                raised
                fontSize={20}
                color='#333333'
                height={80}
                backgroundColor='rgb(247, 229, 59)'
                onPress={() => this.props.navigation.goBack(null)}
                style={{ width: 150, height: 80, alignItems: 'center' }} />
            </Col>
            <Col style={{ height: 0 }}>
              <Button
                title="ENTER"
                large
                raised
                fontSize={20}
                color='#333333'
                backgroundColor='rgb(247, 229, 59)'
                onPress={() => {
                  this.setState({ loading: true });
                  this._login();
                }}
                style={{ width: 150, height: 80, alignItems: 'center' }} />
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
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderRadius: 10,
    minWidth: 80,
    width: 300,
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