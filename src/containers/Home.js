import React from 'react'
import { Alert, RefreshControl, StatusBar, ScrollView, Text, Image, ListView, View, TouchableOpacity, StyleSheet } from 'react-native'
import metrics from '../config/metrics'
import { colors } from '../config/styles'
import images from '../config/images'
import settings from '../config/settings';
import lib from '../lib/scripts';
import { List, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';


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

const recommendedURL = 'http://' + settings.server.url + '/events/recommended/';
const acceptedURL = 'http://' + settings.server.url + '/events/accepted/';

class Home extends React.Component {
  constructor(props) {
    super(props)
    const BACON_IPSUM = 'Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';

    this.state = {
      refreshing: false,
      acceptedSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      }),
      recommendedSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id
      }),
      loaded: false,
      recommendedObjects: [
        {
          title: 'Cathedral Pizzas',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 3,
          address: '123 Cathedral Drive',
          location_details: '3rd floor Room 12',
          organization: '',
          organizer_id: '',
          foodPreferences: [
            {
              id: 3,
              name: "Vegetarian",
              description: "No meat, which includes red meat, poultry, and seafood"
            }
          ],
          image: images.kitchen
        },
        {
          title: 'Market Central Extra Pizzas',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 20,
          address: '456 Super Cool Drive',
          location_details: '3rd floor Room 12',
          organization: '',
          organizer_id: '',
          foodPreferences: [
            {
              id: 2,
              name: "Vegan",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
            {
              id: 3,
              name: "Vegetarian",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
          ],
          image: images.restaurant
        },
        {
          title: 'Free donuts',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 3,
          address: '123 Cathedral Drive',
          location_details: '3rd floor Room 12',
          organization: '',
          organizer_id: '',
          foodPreferences: [
          ],
          // image: images.kitchen
        },
        {
          title: 'Market Central Stir Fry',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 3,
          address: 'Market Central',
          location_details: 'Ground floor of Towers lobby',
          organization: '',
          organizer_id: '',
          foodPreferences: [
            {
              id: 1,
              name: 'Gluten Free',
              description: 'No gluten (including wheat, barley, or rye).'
            },
            {
              id: 2,
              name: "Vegan",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
            {
              id: 3,
              name: "Vegetarian",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
          ],
          // image: images.kitchen
        },
        {
          title: 'Coffee',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 3,
          address: 'Willia Pitt Union',
          location_details: 'Outside of WPU lobby',
          organization: 'CS Club',
          organizer_id: '',
          foodPreferences: [
            {
              id: 1,
              name: 'Gluten Free',
              description: 'No gluten (including wheat, barley, or rye).'
            },
            {
              id: 2,
              name: "Vegan",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
            {
              id: 3,
              name: "Vegetarian",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
          ],
          // image: images.kitchen
        },
      ], 
      dataObjects: [
        {
          title: 'Cathedral Pizzas',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 3,
          address: '123 Cathedral Drive',
          location_details: '3rd floor Room 12',
          organization: '',
          organizer_id: '',
          foodPreferences: [
            {
              id: 3,
              name: "Vegetarian",
              description: "No meat, which includes red meat, poultry, and seafood"
            }
          ],
          image: images.kitchen
        },
        {
          title: 'Market Central Extra Pizzas',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 20,
          address: '456 Super Cool Drive',
          location_details: '3rd floor Room 12',
          organization: '',
          organizer_id: '',
          foodPreferences: [
            {
              id: 2,
              name: "Vegan",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
            {
              id: 3,
              name: "Vegetarian",
              description: "No meat, which includes red meat, poultry, and seafood"
            },
          ],
          image: images.kitchen
        },
        {
          title: 'Free donuts',
          startDate: new Date(),
          endDate: new Date(),
          details: BACON_IPSUM,
          serving: 3,
          address: '123 Cathedral Drive',
          location_details: '3rd floor Room 12',
          organization: '',
          organizer_id: '',
          foodPreferences: [
          ],
          image: images.restaurant
        },
        // {
        //   title: 'Cathedral Pizzas',
        //   startDate: new Date(),
        //   endDate: new Date(),
        //   details: BACON_IPSUM,
        //   serving: 3,
        //   address: '123 Cathedral Drive',
        //   location_details: '3rd floor Room 12',
        //   organization: '',
        //   organizer_id: '',
        //   foodPreferences: [
        //     {
        //       id: 3,
        //       name: "Vegetarian",
        //       description: "No meat, which includes red meat, poultry, and seafood"
        //     }
        //   ],
        //   image: images.kitchen
        // },
        // {
        //   title: 'Cathedral Pizzas',
        //   startDate: new Date(),
        //   endDate: new Date(),
        //   details: BACON_IPSUM,
        //   serving: 3,
        //   address: '123 Cathedral Drive',
        //   location_details: '3rd floor Room 12',
        //   organization: '',
        //   organizer_id: '',
        //   foodPreferences: [
        //     {
        //       id: 3,
        //       name: "Vegetarian",
        //       description: "No meat, which includes red meat, poultry, and seafood"
        //     }
        //   ],
        //   image: images.kitchen
        // }
      ]
    }
    this.renderRow = this.renderRow.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.getEvents = this.getEvents.bind(this);
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.getEvents();
    this.setState({ refreshing: false });    
    console.log('refreshing home');
  }

  componentDidMount() {
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
    return(
      <TouchableOpacity
        onPress = {() => this.props.navigation.navigate('EventDetail', {...event})}>
        <ListItem
          title={event.title}
          />
      </TouchableOpacity>
    )
  }

  getEvents() {
    if (global.user_id !== undefined) {
      // get recommended
      fetch(recommendedURL+global.user_id, { method: 'GET' })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched recommended events");
        var events = responseData['_embedded']['events'];
        console.log('read recommended events');
        this.setState({recommendedSource: this.state.recommendedSource.cloneWithRows(events)});
        console.log('set recommended source')        
      })
      .catch((error) => {
        console.log('failed fetching recommended');
      }).done();

      // get accepted
      fetch(acceptedURL+global.user_id, { method: 'GET' })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("fetched accepted events");
        var events = responseData['_embedded']['events'];
        console.log('read accepted events')
        this.setState({acceptedSource: this.state.acceptedSource.cloneWithRows(events)});
        console.log('set accepted source')        
      })
      .catch((error) => {
        console.log('failed fetching accepted')
      }).done();

      // done loading
      this.setState({ loaded: true });

      return;
    }
  }

  testnav = () => {
    console.log('in home');
    if (global.refresh !== undefined && global.refresh) {
      console.log('have to reload data');
      this.getEvents();
      global.refresh = false;
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index === 0) {
      this.testnav();
      if (!this.state.loaded) {
        this.getEvents();
      }
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
          {/* old */}
          {/* <View style={styles.banner}>
            <Text style={styles.bannerLabel}> {'My Events (' + this.state.dataObjects.length + ')'} </Text>
          </View>
          <List containerStyle={{ marginTop: 0 }}>
            {
              this.state.dataObjects.map((l, i) => (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('EventDetail', { ...l })}
                  key={i}>
                  <ListItem
                    title={l.title}
                  />
                </TouchableOpacity>
              ))
            }
          </List> */}

          {/* new */}          
          <View style={styles.banner}>
            <Text style={styles.bannerLabel}> {'My Events (' + this.state.acceptedSource.getRowCount() + ')'}</Text>
          </View>
          <ListView
            removeClippedSubviews={false}       // forces list to render
            dataSource={this.state.acceptedSource}
            renderRow={(row) => this.renderEvent(row)}
          />

          {/* old */}          
          {/* <View style={styles.banner2}>
            <Text style={styles.bannerLabel}> {'Recommended (' + this.state.recommendedObjects.length + ')'} </Text>
          </View>
          <List containerStyle={{ marginTop: 0 }}>
            {
              this.state.recommendedObjects.map((l, i) => (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('EventDetail', { ...l })}
                  key={i}>
                  <ListItem
                    title={l.title}
                  />
                </TouchableOpacity>
              ))
            }
          </List> */}

          {/* new */}
          <View style={styles.banner2}>
            <Text style={styles.bannerLabel}> {'Recommended (' + this.state.recommendedSource.getRowCount() + ')'}</Text>
          </View>
          <ListView
            removeClippedSubviews={false}       // forces list to render
            dataSource={this.state.recommendedSource}
            renderRow={(row) => this.renderEvent(row)}
            enableEmptySections={true}
          />
        </ScrollView>
      </View>
    )
  }
}

export default Home;
