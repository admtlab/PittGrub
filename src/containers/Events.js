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


@inject("eventStore", "userStore")
@observer
class Events extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      searchText: '',
      loaded: false,
      host: false,      
    }

    this.refreshEvents = this.refreshEvents.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.refreshEvents();
    this.setState({ refreshing: false });
  }

  searchEvents = (text) => {
    if (text.length > 0) {
      this.setState({ searchText: text.toLowerCase() });
    } else {
      this.setState({ searchText: '' });
    }
  }

  componentDidMount() {
    this._onRefresh();
  }

  refreshEvents() {
    const eventStore = this.props.eventStore;
    eventStore.fetchEvents();
    this.setState({ loaded: true });
  }

  renderEvent(event) {
    if (event.title.toLowerCase().indexOf(this.state.searchText) < 0) {
      return(<View/>);
    }
    return(
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EventDetail', { event: event })}>
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

  render() {
    const eventStore = this.props.eventStore;
    const userStore = this.props.userStore;
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
         {userStore.isHost &&
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

export default Events
