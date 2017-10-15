/* @flow */

import React from 'react';
import { ActivityIndicator, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ButtonIconRight } from '../components/Button';
import Logo from '../components/Logo';
import { colors } from '../config/styles';
import { getVerification, postVerification } from '../lib/api';
import { getUser, activateUser } from '../lib/auth';
import { registerForPushNotifications } from '../lib/notifications';


// screen dimensions
var { width, height } = Dimensions.get('window');


export default class VerificationScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      resendText: 'RESEND',
      verificationResent: false,
      code: ''
    };

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
    this._clearState = this._clearState.bind(this);
    this._verification = this._verification.bind(this);
  }

  componentWillMount() {
    // move verification form out of the way when
    // keyboard is coming into view
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);

    // put it back
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardWillShow = () => {
    if (!this.state.loading) {
      this.refs.scrollView.scrollTo({ y: 80, animated: true });
    }
  }

  _keyboardWillHide = () => {
    this.refs.scrollView.scrollTo({ y: 0, animated: true });
  }

  _clearState = async () => {
    this.setState({
      code: '',
      loading: false,
    });
  }

  _verification = () => {
    console.log('Sending verification code: ' + this.state.code);
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
        } else {
          console.log('Response is not ok');
          console.log(response);
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
    const isEnabled = (this.state.code.length == 6);
    return (
      <ScrollView
        ref='scrollView'
        scrollEnabled={false}
        keyboardShouldPersistTaps={'never'}
        paddingTop={height - 550}
        paddingBottom={-height + 550}
        style={styles.container}>
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.view}>
          <Logo size={width / 4} />
          <TextInput
            ref="VerificationCode"
            style={styles.input}
            marginTop={20}
            placeholder="Verification Code"
            maxLength={6}
            placeholderTextColor='#444'
            inputStyle={{ fontSize: 20 }}
            returnKeyType="send"
            autoCapitalize="characters"
            onChangeText={(text) => this.setState({ code: text })}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              this.setState({ loading: true });
              this._verification();
              this.setState({ loading: false });
            }}
            value={this.state.code} />
          {!this.state.loading &&
            <View>
              <Button text="ENTER"
                onPress={() => {
                  Keyboard.dismiss()
                  this.setState({ loading: true });
                  this._verification();
                }}
                disabled={!isEnabled}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
              <ButtonIconRight text={this.state.resendText}
                icon="mail"
                onPress={() => {
                  getVerification()
                    .then(() => {
                      this.setState({ verificationResent: true });
                      this.setState({ resendText: "CHECK YOUR EMAIL" });
                    });
                }}
                disabled={this.state.verificationResent}
                buttonStyle={styles.button}
                textStyle={styles.buttonText} />
            </View>}
          {this.state.loading && <ActivityIndicator color='#fff' />}
        </KeyboardAvoidingView>
      </ScrollView>
    );

    // return(
    //   <View
    //         style={{ flex: 1 }}>
    //         <Text height={0}>{'\n'}</Text>
    //         {!this.state.loading &&
    //           <Grid>
    //             <Col style={{ height: 0 }}>
    //               <Button
    //                 title="RESEND"
    //                 large
    //                 raised
    //                 fontSize={20}
    //                 color='#333333'
    //                 backgroundColor='rgb(247, 229, 59)'
    //                 onPress={() => this.props.navigation.goBack(null)}
    //                 style={{ width: 150, height: 80, alignItems: 'center' }} />
    //             </Col>
    //             <Col style={{ height: 0 }}>
    //               <Button
    //                 title="ENTER"
    //                 large
    //                 raised
    //                 fontSize={20}
    //                 color='#333333'
    //                 backgroundColor='rgb(247, 229, 59)'
    //                 onPress={() => {
    //                   if (this.state.activationCode !== '' && this.state.activationCode.length == 6) {
    //                     this.setState({ loading: true });
    //                     this._verification();
    //                   }
    //                 }}
    //                 style={{ width: 150, height: 80, alignItems: 'center' }} />
    //             </Col>
    //           </Grid>}
    //         {this.state.loading &&
    //           <ActivityIndicator color='#fff' />
    //         }
    //     </Image>
    //         </View>
    //     );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.softBlue,
    height: height,
    width: width,
  },
  view: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    width: width - 100,
    height: 40,
  },
  buttonText: {
    fontSize: width / 20,
  },
  input: {
    fontSize: width / 20,
    width: width,
    height: 40,
    marginBottom: 10,
    color: colors.softGrey,
    backgroundColor: colors.transparentTextEntry,
    alignItems: 'center',
    textAlign: 'center',
  },
});

