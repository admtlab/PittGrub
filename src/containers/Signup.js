import React from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Col, Grid } from 'react-native-elements';
import registerForPushNotifications from '../lib/notifications';
import postSignup from '../lib/api';
import images from '../config/images';
import { getToken, storeUser } from '../lib/auth';


var { width, height } = Dimensions.get('window');
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

export default class SignupScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      alreadyExists: false,
      email: '',
      password: '',
      confirmPassword: '',
      incorrectPassword: false,
    };
  }

  signup = () => {
    if (this.state.email !== '' && this.state.password !== '') {
      let activated = false;
      let accepted = false;
      let status = '';
      postSignup()
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 400) {
          const message = responseData['message'];
          console.log(message);
          if (message.startsWith('User already exists')) {
            this.setState({ alreadyExists: true });
          }
        } else {
          console.log(responseData);
          this.setState({ alreadyExists: false });
          const userId = responseData['id'];
          const admin = responseData['admin']
          activated = responseData['active'];
          status = responseData['status']
          global.admin = admin;
          storeUser(userId, activated, admin)
          .then(() => {
            fetchToken(this.state.email, this.state.password);
          });
        }
      })
      .then(() => {
        this.setState({ loading: false });
        if (status !== "ACCEPTED") {
          this.props.navigation.navigate('Waiting');
        } else if (activated) {
          this.props.navigation.navigate('Home');
        } else if (!this.state.alreadyExists) {
          registerForPushNotifications();
          this.props.navigation.navigate('Verification');
        }
      })
      .catch((error) => {
        console.log(error);
        if (error['message'].startsWith('User already exists with email')) {
          this.setState({ alreadyExists: true });
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
            style={{flex: 1, width: width, height: height, resizeMode: 'cover'}}>
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
  }
}