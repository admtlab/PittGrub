import React from 'react'
import { AsyncStorage, Dimensions, RefreshControl, ListView, View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import metrics from '../config/metrics'
import { inject, observer } from 'mobx-react';
import settings from '../config/settings';
import { colors } from '../config/styles'
import Icon from 'react-native-vector-icons/Ionicons'
import { List, ListItem, SearchBar } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import images from '../config/images'
import lib from '../lib/scripts'
import { getUser } from '../lib/auth';
import { getEvents } from '../lib/api';
import { isHost } from '../lib/user';

var { width, height } = Dimensions.get('window');

// styles
const styles = StyleSheet.create({
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

  container: {
    backgroundColor: colors.facebook,
  },

  headerText: {
    textAlign: 'left',
    fontSize: 13,
    fontWeight: '300',
  },

});

@inject("eventStore")
@observer
class Events extends React.Component {
  constructor(props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/

    this.state = {
      refreshing: false,                              // state is refreshing
      searchText: '',                               // what user is searching for
      eventSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      }),
      loaded: false,
      host: false,      
      createButton: false,
    }

    this.renderRow = this.renderRow.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.fetchEvents();
    this.setState({ refreshing: false });
    console.log('refreshed events');
  }

  _eventsNav = () => {
    console.log('In events tab!');
  }

  testnav = () => {
    console.log('in events');
  }

  searchEvents = (text) => {
    if (text.length > 0) {
      this.setState({ searchText: text.toLowerCase() });
    } else {
      this.setState({ searchText: '' });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index === 1) {
      this.testnav();
    }
  }

  // fetch event data from server
  fetchEvents() {
    getEvents()
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData._embedded.events !== undefined) {
          const events = responseData['_embedded']['events'];
          this.setState({
            eventSource: this.state.eventSource.cloneWithRows(events),
            loaded: true,
          });
        } else {
          this.setState({
            eventSource: this.state.eventSource.cloneWithRows([]),
            loaded: true,
          });
        }
      })
      .catch((error) => {
        console.log('Failed to fetch events\n' + error);
      })
      .done();
  }

  componentWillMount() {
    this.fetchEvents();
    getUser()
    .then((user) => {
      this.setState({ host: isHost(user) });
    })
  }

  renderEvent(event) {
    if (event.title.toLowerCase().indexOf(this.state.searchText) < 0) {
      return(<View/>);
    }
    return(
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EventDetail', { ...event, event: event })}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{event.title}</Text>
          <Text style={styles.subtitle}> {
            lib._convertDate_getMonthDay(new Date(event.start_date)) + '\n ' +
            lib._convertHoursMin(new Date(event.start_date)) + ' - ' +
            lib._convertHoursMin(new Date(event.end_date))}
          </Text>
        </View>
        <View style={styles.rowContentContainer}>
          <Text style={styles.headerText}>{event.details}
          </Text>
        </View>
        <View style={{
          position: 'absolute',
          paddingLeft: metrics.screenWidth - 30,
          paddingTop: 10,
          backgroundColor: colors.transparent,
        }}>
          <Icon name="ios-arrow-forward" size={20} color={'snow'} />
        </View>
      </TouchableOpacity>
    );
  }

  renderRow(rowData, key) {
    return (
      <TouchableOpacity
        key={key}
        onPress={() => this.props.navigation.navigate('EventDetail', { ...rowData })}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.title}</Text>
          <Text style={styles.subtitle}>
            {
              lib._convertHoursMin(rowData.start_date) + ' - ' +
              lib._convertHoursMin(rowData.end_date)
            }
          </Text>
        </View>
        <View style={styles.rowContentContainer} >

          <Text style={styles.headerText}>{rowData.details}</Text>
        </View>
        <View style={{
          position: 'absolute',
          paddingLeft: metrics.screenWidth - 30,
          paddingTop: 10,
          backgroundColor: colors.transparent,
        }}>
          <Icon name="ios-arrow-forward" size={20} color={'snow'} />
        </View>
      </TouchableOpacity>
    )
  }

  noRowData() {
    return this.state.dataSource.getRowCount() === 0
  }

  render() {
    const eventStore = this.props.eventStore;
    return (
      <View>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          height={'100%'}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <SearchBar
            lightTheme
            onClearText={this.clearSearch}
            onChangeText={(value) => this.searchEvents(value)}
            clearIcon={{ color: '#86939e', name: 'clear' }}
            containerStyle={{ backgroundColor: '#fff' }}
            placeholder='Search Event...'
          />
          <ListView
            removeClippedSubviews={false}       // forces list to render
            keyboardShouldPersistTaps={"handled"}
            dataSource={eventStore.eventSource}
            renderRow={(row) => this.renderEvent(row)}
            style={{padding: 0, margin: 0}}
          />
        </ScrollView>
         {this.state.host &&
          <ActionButton style={{marginTop: -10}} buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="Create Event" onPress={() => {
              this.props.navigation.navigate('CreateEvent');
            }}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>}
      </View>
    )
  }
}

export default Events
