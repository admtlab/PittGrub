import { Location, Permissions } from 'expo';
import { inject, observer } from 'mobx-react';
import React from 'react'
import { AsyncStorage, Alert, RefreshControl, StatusBar, ScrollView, Text, Image, ListView, View, TouchableOpacity, StyleSheet } from 'react-native'
import metrics from '../config/metrics'
import { colors } from '../config/styles'
import { distanceMiles } from '../lib/location';
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { registerForPushNotifications } from '../lib/notifications';
import { registerForLocation } from '../lib/location';

const notificationMessage = "PittGrub will alert you of leftover food that you may find interesting. To receive alerts of free food near you, be sure to enable notifications at the next prompt.";

const locationMessage = "PittGrub uses your location to find free food close to you. We keep this information private, and we will never share it with 3rd parties. Please consider enabling location services at the next prompt.";

@inject("tokenStore", "eventStore", "userStore")
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      loaded: false,
    }

    this.renderEvent = this.renderEvent.bind(this);
    this.refreshEvents = this.refreshEvents.bind(this);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.refreshEvents();
    this.setState({ refreshing: false });
  }

  componentDidMount() {
    this._permissions();
    this._onRefresh();
  }

  renderEvent(event) {
    const userStore = this.props.userStore;
    if (!userStore.latitude) {
      Location.getCurrentPositionAsync({ enableHighAccuracy: true })
      .then((location) => {
        userStore.setLatLong(location.coords.latitude, location.coords.longitude);      
      });
    }
    const loc = {
      latitude: userStore.latitude,
      longitude: userStore.longitude
    };
    const eventLoc = {
      latitude: event.latitude,
      longitude: event.longitude
    };
    return(
      <TouchableOpacity
        onPress = {() => this.props.navigation.navigate('EventDetail', { event: event })}>
        {event.latitude
          ? <ListItem
              title={event.title + "  " + distanceMiles(loc, eventLoc) + " miles"}
            />
          : <ListItem title={event.title} />
        }

      </TouchableOpacity>
    )
  }

  refreshEvents() {
    console.log('refreshing events');
    const eventStore = this.props.eventStore;
    eventStore.fetchEvents();
    this.setState({ loaded: true });
  }

  _permissions = async () => {
    const tokenStore = this.props.tokenStore;
    const userStore = this.props.userStore;
    registerForPushNotifications(tokenStore.accessToken);
    registerForLocation(tokenStore.accessToken, userStore);
  }

  render() {
    const tokenStore = this.props.tokenStore;
    const eventStore = this.props.eventStore;
    return (
      <View>
        <StatusBar
          backgroundColor="red"
          containerStyle={{ minHeight: 80 }}
          hidden={false}
        />
        <ScrollView style={styles.scrollView}
        refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <View style={styles.banner}>
            <Text style={styles.bannerLabel}> {'Interested (' + eventStore.acceptedSource.getRowCount() + ')'}</Text>
          </View>
          {eventStore.acceptedSource.getRowCount() == 0 &&
            <Text fontSize={18}>You have not signed up for any events yet. Check out what's available!</Text>
          }
          {eventStore.acceptedSource.getRowCount() > 0 &&
            <ListView
              removeClippedSubviews={false}       // forces list to render
              dataSource={eventStore.acceptedSource}
              renderRow={(row) => this.renderEvent(row)}
            />
          }

          <View style={styles.banner2}>
            <Text style={styles.bannerLabel}> {'Recommended (' + eventStore.openRecommendedSource.getRowCount() + ')'}</Text>
          </View>
          {/*eventStore.openRecommendedSource.getRowCount() == 0 &&
            <Text fontSize={36}>
              {"There are no events currently. You will be notified for newly added events!"}
            </Text>
          */}
          {eventStore.openRecommendedSource.getRowCount() >= 0 &&
            <ListView
              removeClippedSubviews={false}       // forces list to render
              dataSource={eventStore.openRecommendedSource}
              renderRow={(row) => this.renderEvent(row)}
              enableEmptySections={true}
            />
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 10
  },
  scrollView: {
    maxHeight: metrics.screenHeight - metrics.tabBarHeight,
    paddingBottom: 150 + metrics.tabBarHeight,
    marginBottom: metrics.tabBarHeight + 100,
  },
  logo: {
    height: 200,
    resizeMode: 'contain',
  },
  banner: {
    width: metrics.screenWidth,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    backgroundColor: 'steelblue'
  },
  banner2: {
    width: metrics.screenWidth,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    backgroundColor: '#009688'
  },
  bannerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'snow',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  row: {
    flex: 1,
    backgroundColor: colors.facebook2,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingBottom: 10,
  },
  rowContentContainer: {
    flex: 1,
    backgroundColor: 'snow',
    justifyContent: 'flex-start',
    padding: 20
  },
  boldLabel: {
    fontWeight: 'bold',
    color: 'snow',
    textAlign: 'left',
    marginVertical: metrics.smallMargin
  },
  label: {
    textAlign: 'left',
    color: colors.snow,
    marginBottom: metrics.smallMargin
  },
});

export default Home;
