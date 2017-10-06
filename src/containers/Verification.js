import React from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Col, Grid } from 'react-native-elements';
import { postVerification } from '../lib/api';
import { getUser, activateUser } from '../lib/auth';
import registerForPushNotifications from '../lib/notifications';
import images from '../config/images';


var { width, height } = Dimensions.get('window');


export default class VerificationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      code: ''
    };

    this._verification = this._verification.bind(this);
  }

  _verification = () => {
    postVerification(this.state.code)
    .then((response) => {
      if (response.ok) {
        console.log('response is ok');
        let status = '';
        activateUser();
        console.log('user activated');
        registerForPushNotifications();
        console.log('did push');
        getUser()
        .then((user) => {
          console.log('got user');
          console.log(user);
          status = user.status;
          if (status !== 'ACCEPTED') {
            console.log('not accepted');
            this.props.navigation.navigate('Waiting');
          } else {
            console.log('accpted');
            this.props.navigation.navigate('Home');
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
    })
    .catch((error) => {
      console.log('failed activation');
    })
    .done(() => {
      this.setState({ loading: false });
    })
  }

  render() {
    return(
      <View
        style={{flex: 1}}>
          <Image
            source={images.enter}
            style={{flexGrow: 1, width: width, height: height, resizeMode: 'cover', alignContent: 'center', alignItems: 'center'}}>
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
                      this._verification();
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
