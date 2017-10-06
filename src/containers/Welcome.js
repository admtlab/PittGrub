import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Button, Col, Grid } from 'react-native-elements';
import images from '../config/images';
import { getToken, getUser } from '../lib/auth';


var { width, height } = Dimensions.get('window');


export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      activationCode: '',
    };
    this.checkActivation = this.checkActivation.bind(this);
  }

  checkActivation = () => {
    getUser()
    .then((user) => {
      if (user !== null && user !== undefined) {
        if (user.activated) {
          getToken()
          .then((token) => {
            if (token !== null && token !== undefined) {
              console.log('User is activated and logged in');
              this.props.navigation.navigate('Home');
            }
          });
        } else if (user.activated !== null && user.activated !== undefined) {
          console.log('User must activate');
          this.props.navigation.navigate('Verification');
        }
      }
    });
  }

  render() {
    this.checkActivation();
    // must log in or sign up
    return (
      <View
        style={{flex: 1}}>
        <Image
          source={images.enter}
          style={{flex: 1, width: width, height: height, resizeMode: 'cover'}}>
          <Grid>
            <Col
              style={{marginTop: 400, height: 0, backgroundColor: 'transparent'}}>
              <Button
                title="SIGN UP"
                large
                raised
                fontSize={20}
                color='#333333'
                height={80}
                borderRadius={10}
                backgroundColor='rgb(247, 229, 59)'
                onPress={() =>
                  this.props.navigation.navigate('Signup')
                }
                style={{width: 150, height: 80, alignItems: 'center'}}/>
            </Col>
            <Col
              style={{marginTop: 400, height: 0, backgroundColor: 'transparent'}}>
              <Button
              title="LOG IN"
              large
              raised
              fontSize={20}
              borderRadius={10}
              color='#333333'
              width={20}
              backgroundColor='rgb(247,229,59)'
              onPress={() =>
                this.props.navigation.navigate('Login')
              }
              style={{height: 80, alignItems: 'center'}}/>
            </Col>
          </Grid>
        </Image>
      </View>
    );
  }
}
