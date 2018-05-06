import React from 'react';
import { AsyncStorage, Dimensions, Image, View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ListItem, Icon, Card, Button, FormLabel, Grid, Col } from 'react-native-elements';
import metrics from '../config/metrics';
import { inject, observer } from 'mobx-react';
import { colors } from '../config/styles';
import images from '../config/images';
import settings from '../config/settings';
import { NavigationActions } from 'react-navigation';
import { postAcceptEvent } from '../lib/api';
import lib from '../lib/scripts';

const server = settings.server.url;
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  description_text: {
    fontSize: 16,
    fontWeight: '300',
    paddingTop: 10,
    marginBottom: 10
  },
  title_text: {
    fontSize: 20,
    fontWeight: '200',
    paddingTop: 10,
  },
  header_text: {
    fontSize: 18,
    fontWeight: '200',
    color: '#455A64'
  },
  normal: {
    fontSize: 16,
    fontWeight: '300',
    paddingTop: 3,
    paddingBottom: 15
  },
  normal2: {
    fontSize: 16,
    fontWeight: '300',
    paddingTop: 2,
    paddingLeft: 5,
  },
})

@inject("tokenStore")
@observer
export default class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: true,
    }
    this._renderFoodPreferences = this._renderFoodPreferences.bind(this)
    this._getEventImage = this._getEventImage.bind(this);
  }

  _renderFoodPreferences(foodName, i) {
    return (
      <View index={i}>
        <Icon name='cake' />
        <Text>{foodName}</Text>
      </View>
    )

  }

  _getEventImage = () => {
    const eventId = this.props.navigation.state.params.event.id;
    const imageEndpoint = settings.server.url + '/events/' + eventId + '/images/';
    fetch(imageEndpoint, {
      method: 'GET',
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log('image id: ' + json);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const tokenStore = this.props.tokenStore;
    const event = this.props.navigation.state.params.event;
    console.log(this.props);
    const imageEndpoint = settings.server.url + '/events/' + event.id + '/images/';
    return (
      <ScrollView style={{ backgroundColor: colors.lightBackground }}>
        {/* <Card> */}
          {this.state.image &&
          <Image source={{uri: imageEndpoint}}
            style={{height: width}}
            onError={() => {this.setState({ image: false })}}
            />
          }
        <Card>
          <Text style={styles.title_text}>
            {event.title}
          </Text>

          <Text style={styles.description_text}>
            {event.details}
          </Text>
        </Card>
        {!event.accepted && 
        <Button
          icon={{ name: 'done' }}
          backgroundColor='#03A9F4'
          style={{ paddingTop: 10 }}
          buttonStyle={{ borderRadius: 10 }}
          onPress={
            () => {
              event.accepted = true;
              console.log('Signed up for ' + event.id);
              postAcceptEvent(tokenStore.accessToken, event.id)
              .then(() => {
                this.props.navigation.goBack(null);
              });
            }
          }
          title='INTERESTED' />
        }
        <Card>
          <Text style={styles.header_text}>Location</Text>
          <Text style={styles.normal}>{event.address}</Text>
          <Text style={styles.header_text}>Details</Text>
          <Text style={styles.normal}>{event.location}</Text>

          <Text style={styles.header_text}>Date and Time</Text>
          <Text style={styles.normal}>{
            lib._convertDate_getMonthDay(new Date(event.start_date)) + '\n' +
            lib._convertHoursMin(new Date(event.start_date)) + ' ~ ' +
            lib._convertHoursMin(new Date(event.end_date))
          }
          </Text>
          <Text style={styles.header_text}>Food Preferences</Text>
          {
            event['food_preferences'].map((obj, i) => {
              return (
                <View key={i} style={{
                  paddingTop: 5,
                  flexDirection: 'row'
                }}>
                  <Icon
                    name='check-circle'
                    color='#009688' />
                  <Text style={styles.normal2}>{obj.name}</Text>
                </View>


              )
            })
          }
        </Card>
      </ScrollView>
    )
  }
}
