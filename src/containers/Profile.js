import React from 'react'
import { Switch, ScrollView, Text, Image, View, TouchableHighlight, StyleSheet } from 'react-native'
import { Button, CheckBox, FormLabel, FormInput} from 'react-native-elements'
import metrics from '../config/metrics'
import colors from '../config/styles'
import images from '../config/images'
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
  }
});

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glutenFree: false,
      dairyFree: false,
      vegetarian: false,
      vegan: false
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

  render() {
    return (
      <ScrollView style={styles.viewContainer}>
        <FormLabel labelStyle={styles.title}>Food Preferences</FormLabel>
        <Text
          style={{fontSize: 15, margin: 5, marginLeft: 20, marginRight: 20}}>
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
