import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Metrics from '../Styles/Metrics'
import Colors from '../Styles/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import { List, ListItem, SearchBar } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Images from '../Styles/Images'
import lib from '../library/scripts'

// Styles
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
    backgroundColor: Colors.facebook2,
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
    marginVertical: Metrics.smallMargin
  },
  label: {
    textAlign: 'left',
    color: Colors.snow,
    marginBottom: Metrics.smallMargin
  },

  container: {
    backgroundColor: Colors.facebook,
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
          ],
          image: Images.kitchen
        },
        {
          title: 'Market Central Food Tasting',
          startDate: new Date(),
          endDate: new Date(),
          details: VEGGIE_IPSUM,
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
          image: Images.restaurant
        },
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
          image: Images.kitchen

        },
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
          image: Images.kitchen

        },
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
          image: Images.kitchen

        }
      ]
    }

    this.renderRow = this.renderRow.bind(this)
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
              lib._convertHoursMin(rowData.startDate) + ' - ' +
              lib._convertHoursMin(rowData.endDate)
            }
          </Text>
        </View>
        <View style={styles.rowContentContainer} >

          <Text style={styles.headerText}>{rowData.details}</Text>
        </View>
        <View style={{
          position: 'absolute',
          paddingLeft: Metrics.screenWidth - 30,
          paddingTop: 10,
          backgroundColor: Colors.transparent,
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
        <ScrollView>
          <SearchBar
            lightTheme
            containerStyle={{ backgroundColor: '#fff' }}
            placeholder='Search Event...' />

          <List style={{ padding: 0, margin: 0 }}>
            {
              this.state.dataObjects.map((rowData, i) => (
                this.renderRow(rowData, i)
              ))
            }
          </List>
        </ScrollView>
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="Create Event" onPress={() => {
            this.props.navigation.navigate('CreateEvent');
          }}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    )
  }
}

export default Events
