import React from 'react'
import { StatusBar, ScrollView, Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import Metrics from '../Styles/Metrics'
import Colors from '../Styles/Colors'
import Images from '../Styles/Images'
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
      width: Metrics.screenWidth,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      backgroundColor: 'steelblue'
    
  },
  banner2: {
      width: Metrics.screenWidth,
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
  constructor (props) {
    super(props)
    const BACON_IPSUM = 'Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';
    
    this.state = {

        dataObjects: [
        {
          title: 'Cathedral Pizzas', 
          startDate: new Date(), 
          endDate: new Date(),
          details: BACON_IPSUM , 
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
          title: 'Market Central Extra Pizzas', 
          startDate: new Date(), 
          endDate: new Date(),
          details: BACON_IPSUM , 
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
          image: Images.restaurant1
        },
        {
          title: 'Cathedral Pizzas', 
          startDate: new Date(), 
          endDate: new Date(),
          details: BACON_IPSUM , 
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
          details: BACON_IPSUM , 
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
          details: BACON_IPSUM , 
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
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    console.log('Fetching' + root);
    this.fetchData(root);
  }

  renderRow(rowData) {
    return (
        <TouchableOpacity style={{paddingBottom: 10}}>
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

  fetchData(url) {
    console.log('\n\nfetching data\n')
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)

        this.setState({dataObjects: responseJson._embedded.events})

      })
      .catch(function(error) {
        console.log(error);
      })
      .done();
  }

  render () {
    return (
      
      <View>
          <StatusBar
            backgroundColor="red"
            containerStyle={{minHeight: 80}}
            //barStyle="light-content"
            hidden={false}
          />
          <View style={styles.container}>
            <Image source={Images.clearLogo} style={styles.logo} />
          </View>

          <View style={styles.banner}>
             <Text style={styles.bannerLabel}> {'My Events ('+this.state.dataObjects.length+')'} </Text>
          </View>
            <ScrollView style={{ minHeight: 0, maxHeight: 150}}>
              <List containerStyle={{marginTop: 0}}>
                {
                  this.state.dataObjects.map((l, i) => (
                    <TouchableOpacity  
                      onPress = {()=>this.props.navigation.navigate('EventDetail', {...l})}
                      key={i}>
                      <ListItem
                        title={l.title}
                      />
                    </TouchableOpacity>
                  ))
                }
              </List>
            </ScrollView>

            <View style={styles.banner2}>
             <Text style={styles.bannerLabel}> {'Recommended ('+this.state.dataObjects.length+')'} </Text>
            </View>
            <ScrollView style={{minHeight: 0, maxHeight: 202}}>
              <List containerStyle={{marginTop: 0}}>
                {
                  this.state.dataObjects.map((l, i) => (
                    <TouchableOpacity  
                      onPress = {()=>this.props.navigation.navigate('EventDetail', {...l})}
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