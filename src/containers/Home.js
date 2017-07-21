import React from 'react'
import { RefreshControl, StatusBar, ScrollView, Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import metrics from '../config/metrics'
import colors from '../config/styles'
import images from '../config/images'
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
});

const root = 'http://db10.cs.pitt.edu:8080/event'

class Home extends React.Component {
  constructor(props) {
    super(props)
    const BACON_IPSUM = 'Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';

    this.state = {
      refreshing: false,
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
    this.renderRow = this.renderRow.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }

  _onRefresh() {
    console.log('refreshing home');
  }

  componentDidMount() {
    console.log('Fetching' + root);
    // this.fetchData(root);
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity style={{ paddingBottom: 10 }}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.title}</Text>
          <Text style={styles.subtitle}>{rowData.time}</Text>
        </View>
        <View style={styles.rowContentContainer} >

          <Text style={styles.headerText}>{rowData.details}</Text>
        </View>
        <View style={{
          paddingLeft: 330,
          paddingTop: 10,
          backgroundColor: Colors.transparent,
        }}>
          <Icon name="ios-arrow-forward" size={20} color={Colors.snow} />
        </View>
      </TouchableOpacity>
    )
  }

  testnav = () => {
    console.log('in home');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index === 0) {
      this.testnav();
    }
  }

  fetchData(url) {
    console.log('\n\nfetching data\n')
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({ dataObjects: responseJson._embedded.events })
      })
      .catch(function (error) {
        console.log(error);
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
        <View style={styles.container}>
          <Image source={images.clearLogo} style={styles.logo} />
        </View>

        <ScrollView style={{ maxHeight: metrics.screenHeight - 200 - metrics.tabBarHeight, paddingBottom: 200 + metrics.tabBarHeight }}
        refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <View style={styles.banner}>
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
          </List>
          {/*</ScrollView>*/}

          <View style={styles.banner2}>
            <Text style={styles.bannerLabel}> {'Recommended (' + this.state.recommendedObjects.length + ')'} </Text>
          </View>
          {/*<ScrollView style={{minHeight: 0, maxHeight: 202}}>*/}
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
          </List>
        </ScrollView>
      </View>
    )
  }
}

export default Home;
