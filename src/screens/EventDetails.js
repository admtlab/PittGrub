import { acceptEvent } from '../api/event';
import { colors } from '../config/styles';
import { parseDateRange } from '../lib/time';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';


@inject('tokenStore')
@observer
export default class EventDetails extends Component {
  state = {
    loading: false,
    image: null,
  };

  _acceptEvent = async () => {
    const { event } = this.props.navigation.state.params;
    this.setState({ loading: true });
    event.accepted = true;
    const token = await this.props.tokenStore.getOrFetchAccessToken();
    setTimeout(() => this.setState({ loading: false }), 2000);
    // acceptEvent(token, event.id)
    // .then(() => event.accepted = true))
    // .catch(this._handleError)
    // .finally(() => this.setState({loading: false}))
  }

  _handleError = () => {
    Alert.alert(
      'Error',
      'Unable to complete your request. Please try again later.',
      { text: 'OK' },
    );
  }

  _foodPreference = (pref) => (
    <View key={pref.id} style={[styles.headerView, {marginLeft: 10, marginBottom: 5}]}>
      <Icon name='check-circle' color='#009688' />
      <Text style={{ fontSize: 18, fontWeight: '300', paddingLeft: 5 }}>
        {pref.name}
      </Text>
    </View>
  );
  
  _foodPreferenceDetails = (prefs) => (
    <Fragment>
      {prefs.length > 2 ? (
        <View marginHorizontal={20} alignItems='center'>
          <View style={{ flexDirection: 'row' }}>
            {prefs.slice(0,2).map(this._foodPreference)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {prefs.slice(2,4).map(this._foodPreference)}
          </View>
        </View>
      ) : (
        <View flexDirection='row' marginHorizontal={20} alignItems='center'>
          {prefs.map(this._foodPreference)}
        </View>
      )}
    </Fragment>
  );

  render() {
    const { event } = this.props.navigation.state.params;
    const { title, description, address, location, start_date, end_date, food_preferences, accepted } = event;
    return (
      <ScrollView style={{ backgroundColor: colors.lightBackground, paddingBottom: 20 }}>
        <Card
          title={title}
          image={require('../../assets/garfield.jpg')}
          titleStyle={styles.title}
          imageStyle={{height: 300}}
        >
          <View alignItems='center'>
            <Text style={[styles.details, {marginBottom: 15}]}>{description}</Text>
          </View>
          <Button 
            title='INTERESTED'
            icon={!accepted && !this.state.loading ? { name: 'done' } : null}
            onPress={this._acceptEvent}
            loading={this.state.loading}
            borderRadius={8}
            paddingTop={10}
            backgroundColor='#03A9F4'
            disabled={accepted}
          />
        </Card>
        <Card title='Details' titleStyle={styles.cardTitle}>
          <View marginBottom={20}>
            <View style={styles.headerView}>
              <Text style={styles.header}>Location</Text>
              <Icon name='location-pin' type='entypo' size={20} color={colors.darkGrey} marginLeft={5} />
            </View>
            <Text style={styles.details}>{address}</Text>
            <Text style={styles.details}>{location}</Text>
          </View>

          <View style={styles.headerView}>
            <Text style={styles.header}>Date and Time</Text>
            <Icon name='access-time' size={20} color={colors.darkGrey} marginLeft={5} />
          </View>
          <Text style={styles.details}>{parseDateRange(start_date, end_date)}</Text>
        </Card>

        <Card title='Food Preferences' titleStyle={styles.cardTitle} containerStyle={{marginBottom: 20}}>
          {this._foodPreferenceDetails(food_preferences)}
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '300',
    paddingHorizontal: 5,
  },
  cardTitle: {
    fontSize: 20
  },
  headerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.darkGrey,
    marginBottom: 2,
  },
  details: {
    fontSize: 18,
    fontWeight: '300',
    paddingTop: 3,
    marginLeft: 10,
  },
});