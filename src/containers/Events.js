import React from 'react'
import { AsyncStorage, Dimensions, RefreshControl, ListView, View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import metrics from '../config/metrics'
import settings from '../config/settings';
import { colors } from '../config/styles'
import Icon from 'react-native-vector-icons/Ionicons'
import { List, ListItem, SearchBar } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import images from '../config/images'
import lib from '../lib/scripts'
import { getUser } from '../lib/auth';

const eventsURL = settings.server.url + '/events';
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

class Events extends React.Component {
  constructor(props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    const BACON_IPSUM = 'Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';

    const VEGGIE_IPSUM = 'Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic. Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.'

    this.state = {
      admin: false,
      refreshing: false,                              // state is refreshing
      searchText: '',                               // what user is searching for
      eventSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      }),
      loaded: false,
      createButton: false,
    }

    this.renderRow = this.renderRow.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.getEvents();
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
  getEvents() {
    return fetch(eventsURL, { method: 'GET' })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Successfully fetched events");
        console.log(responseData);
        if (responseData._embedded.events !== undefined) {
          const events = responseData['_embedded']['events'];
          this.setState({
            eventSource: this.state.eventSource.cloneWithRows(events),
            loaded: true
          });
        } else {
          this.setState({
            eventSource: this.state.eventSource.cloneWithRows([]),
            loaded: true
          })
        }
      })
      .catch((error) => {
        console.log('failed fetch');
        console.log(error);
      })
      .done();
  }

  componentWillMount() {
    this.getEvents();
    getUser()
    .then((user) => {
      this.setState({ admin: user.admin });
    })
  }

  renderEvent(event) {
    if (event.title.toLowerCase().indexOf(this.state.searchText) < 0) {
      return(<View/>);
    }
    return(
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EventDetail', { ...event })}>
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
            dataSource={this.state.eventSource}
            renderRow={(row) => this.renderEvent(row)}
            style={{padding: 0, margin: 0}}
          />
        </ScrollView>
         {this.state.admin &&
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
