import React from 'react'
import { View, Text, ScrollView,  StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Metrics from '../Styles/Metrics'
import Colors from '../Styles/Colors'
import Icon from 'react-native-vector-icons/Ionicons';
import { List, ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button';
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
  content: {
    padding: 20,
    backgroundColor: '#fff',
    
    
  },
  
});

class Events extends React.Component {
  constructor (props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    const BACON_IPSUM = 'Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';
    
    this.state = {
        dataObjects: [
        {title: 'Coffee/Tea By Cathedral', time: '3:00pm - 4:00pm', details: BACON_IPSUM , amt: 3},
        {title: 'Market Central Extra Pizzas', time: '9:15am - 1:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Spanish Conference Donuts', time: '2:00pm - 9:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Fish Tacos By WPU', time: '10:00am - 11:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Coffee/Tea By Cathedral', time: '3:00pm - 4:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Market Central Extra Pizzas', time: '9:15am - 1:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Spanish Conference Donuts', time: '2:00pm - 9:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Fish Tacos By WPU', time: '10:00am - 11:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Coffee/Tea By Cathedral', time: '3:00pm - 4:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Market Central Extra Pizzas', time: '9:15am - 1:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Spanish Conference Donuts', time: '2:00pm - 9:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Fish Tacos By WPU', time: '10:00am - 11:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Coffee/Tea By Cathedral', time: '3:00pm - 4:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Market Central Extra Pizzas', time: '9:15am - 1:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Spanish Conference Donuts', time: '2:00pm - 9:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Fish Tacos By WPU', time: '10:00am - 11:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Coffee/Tea By Cathedral', time: '3:00pm - 4:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Market Central Extra Pizzas', time: '9:15am - 1:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Spanish Conference Donuts', time: '2:00pm - 9:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Fish Tacos By WPU', time: '10:00am - 11:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Coffee/Tea By Cathedral', time: '3:00pm - 4:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Market Central Extra Pizzas', time: '9:15am - 1:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Spanish Conference Donuts', time: '2:00pm - 9:00pm', details: BACON_IPSUM, amt: 3},
        {title: 'Fish Tacos By WPU', time: '10:00am - 11:00pm', details: BACON_IPSUM, amt: 3},
      
      ]
    
    }
  
    
    this.renderRow = this.renderRow.bind(this)
  }
  
  renderRow (rowData, key) {
    return (
        <TouchableOpacity style={{paddingBottom: 10}} key={key}>
          <View style={styles.row}>
            <Text style={styles.boldLabel}>{rowData.title}</Text>
            <Text style={styles.subtitle}>{rowData.time}</Text>
          </View>
          <View style={styles.rowContentContainer} >
          
          <Text style={styles.headerText}>{rowData.details}</Text>
          </View>
            <View style={{
              position: 'absolute',
              paddingLeft: 330,
              paddingTop: 10,
              backgroundColor: Colors.transparent,
            }}>
              <Icon name="ios-arrow-forward" size={20} color={'snow'} />
            </View>
          </TouchableOpacity>
     
    )
  }


  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  

  render () {
    return (
        <View>
            <ScrollView>
                <StatusBar hidden={true} />

                <List container>
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
