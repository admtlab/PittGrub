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
      backgroundColor: '#607D8B',
      alignItems: 'center',
      zIndex: 10
    },
    logo: {
      height: Metrics.images.logo,
      width: Metrics.images.logo,
      resizeMode: 'contain',
    },
    banner: {
      width: Metrics.screenWidth,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      marginTop: 30,
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

class Home extends React.Component {
  constructor (props) {
    super(props)
    const BACON_IPSUM = 'Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';
    
    this.state = {
        dataObjects: [
        {
          title: 'Hello WOrld', 
          startDate: new Date(), 
          endDate: new Date(),
          details: BACON_IPSUM , 
          serving: 3, 
          address: '123 Cathedral Drive',
          location_details: '3rd floor Room 12',
          options: {
            veg: true,
            vegan: true
          }

        },
        {
          title: 'Market Central Extra Pizzas', 
          startDate: new Date(), 
          endDate: new Date(),
          details: BACON_IPSUM , 
          serving: 20, 
          address: '123 Cathedral Drive',
          location_details: '3rd floor Room 12',
          options: {
            veg: false,
            vegan: false,
          }
        }
      
      ]
    
    }
  
    
    this.renderRow = this.renderRow.bind(this)
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

  render () {
    return (
      
      <View style={{backgroundColor: Colors.lightBackground}}>

          
          <StatusBar
            backgroundColor="blue"
            barStyle="light-content"
          />
          <View style={styles.container}>
            <Image source={Images.clearLogo} style={styles.logo} />
          </View>
            <View style={styles.banner}>
             <Text style={styles.bannerLabel}> My Events </Text>
            </View>
            <ScrollView style={{minHeight: 150, maxHeight: 150}}>
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
             <Text style={styles.bannerLabel}> Recommended </Text>
            </View>
            <ScrollView style={{minHeight: 150, maxHeight: 150}}>
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