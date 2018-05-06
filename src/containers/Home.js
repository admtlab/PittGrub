import React from 'react'
import { AsyncStorage, Alert, RefreshControl, StatusBar, ScrollView, Text, Image, ListView, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Location, Permissions } from 'expo';
import { inject, observer } from 'mobx-react';
import metrics from '../config/metrics'
import { colors } from '../config/styles'
import images from '../config/images'
import settings from '../config/settings';
import lib from '../lib/scripts';
import { getEvents } from '../lib/api';
import { distanceMiles } from '../lib/location';
import { List, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';
import registerForPushNotifications from '../lib/notifications';
import registerForLocation from '../lib/location';

const notificationMessage = "PittGrub will alert you of leftover food that you may find interesting. To receive alerts of free food near you, be sure to enable notifications at the next prompt.";

const locationMessage = "PittGrub uses your location to find free food close to you. We keep this information private, and we will never share it with 3rd parties. Please consider enabling location services at the next prompt.";

const recommendedURL = settings.server.url + '/events/recommended/';
const acceptedURL = settings.server.url + '/events/accepted/';

@inject("tokenStore", "eventStore", "userStore")
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      acceptedSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      }),
      recommendedSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      }),
      loaded: false,
    }

    this.renderRow = this.renderRow.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.refreshEvents = this.refreshEvents.bind(this);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    this.refreshEvents();
    this.setState({ refreshing: false });
    console.log('refreshing home');
    console.log('\n\nprops:');
    console.log(this.props);
  }

  componentDidMount() {
    console.log('home mounted');
    global.refresh = true;
    this._permissions();
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity style={{ paddingBottom: 10 }}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.title}</Text>
          <Text style={styles.subtitle}>{rowData.start_date}</Text>
        </View>
        <View style={styles.rowContentContainer} >

          <Text style={styles.headerText}>{rowData.details}</Text>
        </View>
        <View style={{
          paddingLeft: 330,
          paddingTop: 10,
          backgroundColor: colors.transparent,
        }}>
          <Icon name="ios-arrow-forward" size={20} color={colors.snow} />
        </View>
      </TouchableOpacity>
    )
  }

  // renderEvent(event) {
  //   return(
  //     <TouchableOpacity
  //       onPress={() => this.props.navigation.navigate('EventDetail', { ...event })}>
  //       <View style={styles.row}>
  //         <Text style={styles.boldLabel}>{event.title}</Text>
  //         <Text style={styles.subtitle}> {
  //           lib._convertHoursMin(new Date(event.start_date)) + ' - ' +
  //           lib._convertHoursMin(new Date(event.end_date))}
  //         </Text>
  //       </View>
  //       <View style={styles.rowContentContainer}>
  //         <Text style={styles.headerText}>{event.details}
  //         </Text>
  //       </View>
  //       <View style={{
  //         position: 'absolute',
  //         paddingLeft: metrics.screenWidth - 30,
  //         paddingTop: 10,
  //         backgroundColor: colors.transparent,
  //       }}>
  //         <Icon name="ios-arrow-forward" size={20} color={'snow'} />
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }

  renderEvent(event) {
    const userStore = this.props.userStore;
    if (!userStore.latitude) {
      Location.getCurrentPositionAsync({ enableHighAccuracy: true }).then((location) => {
        console.log('got location: ');
        console.log(location);
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
        onPress = {() => this.props.navigation.navigate('EventDetail', { ...event, event: event })}>
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
    // const tokenStore = this.props.tokenStore;
    // const eventStore = this.props.eventStore;
    // getEvents(tokenStore.accessToken)
    // .then((response) => {
    //   if (!response.ok) { throw response };
    //   return response.json();
    // })
    // .then((responseData) => {
    //   const events = responseData['_embedded']['eventViews'];
    //   eventStore.setEvents(events);
    //   console.log('got events');
    //   console.log(eventStore.events);
    // })
    // .catch((error) => {
    //   console.log('failed fetching events');
    //   console.log(error);
    // })
    // .done();
    this.setState({ loaded: true });

    // AsyncStorage.getItem('user')
    // .then((user) => {
    //   user = JSON.parse(user);
    //   console.log('getting home events');
    //   if (user !== undefined && user !== null) {
    //     // get recommended
    //     fetch(recommendedURL+user.id, { method: 'GET' })
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //       console.log("Fetched recommended events");
    //       if (responseData._embedded.events !== undefined) {
    //         console.log('read recommended events');
    //         let events = responseData['_embedded']['events'];
    //         this.setState({recommendedSource: this.state.recommendedSource.cloneWithRows(events)});
    //       } else {
    //         this.setState({recommendedSource: this.state.recommendedSource.cloneWithRows([])});
    //       }
    //       console.log('set recommended source')
    //     })
    //     .catch((error) => {
    //       console.log('failed fetching recommended');
    //       console.log(error);
    //     }).done();

    //     // get accepted
    //     fetch(acceptedURL+user.id, { method: 'GET' })
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //       console.log("fetched accepted events");
    //       if (responseData._embedded.events !== undefined) {
    //         console.log('read accepted events')
    //         let events = responseData['_embedded']['events'];
    //         this.setState({acceptedSource: this.state.acceptedSource.cloneWithRows(events)});
    //       } else {
    //         this.setState({acceptedSource: this.state.acceptedSource.cloneWithRows([])});
    //       }
    //       console.log('set accepted source')
    //     })
    //     .catch((error) => {
    //       console.log('failed fetching accepted');
    //       console.log(error);
    //     }).done();

    //     // done loading
    //     this.setState({ loaded: true });

    //     return;
    //   }
    // });
  }

  _permissions = async () => {
    console.log('Getting permissions');
    // if (this.state.location == null || this.state.location == undefined) {
    //   console.log('Requesting');
    //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //   if (status == 'granted') {
    //     let location = await Location.getCurrentPositionAsync({});
    //     console.log('got location');
    //     console.log(JSON.stringify(location));
    //     this.setState({ location: JSON.stringify(location)});
    //   } else {
    //     this.setState({ location: null });
    //   }
    // }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(newProps) {
    console.log('receiving props in home');
    if (!this.state.loaded) {
      this.refreshEvents();
    }
    if (newProps.screenProps.route_index == 0) {
      console.log("In home");
    }
  }

  fetchData(url) {
    console.log('\n\nfetching data\n')
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ dataObjects: responseJson._embedded.events })
      })
      .catch(function (error) {
      })
      .done();
  }

  render() {
    const tokenStore = this.props.tokenStore;
    const eventStore = this.props.eventStore;
    console.log('props');
    console.log('homes view of accepted events');
    console.log(eventStore.accepted);
    return (
      <View>
        <StatusBar
          backgroundColor="red"
          containerStyle={{ minHeight: 80 }}
          //barStyle="light-content"
          hidden={false}
        />
        {/* <View style={styles.container}>
          <Image source={images.clearLogo} style={styles.logo} />
        </View> */}

        <ScrollView style={{ maxHeight: metrics.screenHeight - metrics.tabBarHeight, paddingBottom: 150 + metrics.tabBarHeight, marginBottom: metrics.tabBarHeight + 100 }}
        refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <View style={styles.banner}>
            <Text style={styles.bannerLabel}> {'My Events (' + eventStore.acceptedSource.getRowCount() + ')'}</Text>
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
          {eventStore.openRecommendedSource.getRowCount() == 0 &&
            <Text fontSize={18}>There are no events currently. You will be notified for newly added events!</Text>
          }
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
    fontSize: 15,
    fontWeight: 'bold',
    color: 'snow',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  subtitle: {
    color: 'snow',
    fontSize: 10
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
  headerText: {
    textAlign: 'left',
    fontSize: 13,
    fontWeight: '300',
  },
});

export default Home;
