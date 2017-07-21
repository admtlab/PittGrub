import React from 'react';

import {View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {ListItem, Icon, Card, Button, FormLabel, Grid, Col } from 'react-native-elements'
import Metrics from '../Styles/Metrics'
import Colors from '../Styles/Colors'
import Images from '../Styles/Images'
import { NavigationActions } from 'react-navigation'
import lib from '../library/scripts'

const styles = StyleSheet.create({
    description_text: {
        fontSize: 16,
        fontWeight: '300',
        paddingTop: 10,
        marginBottom: 10
    },
    title_text: {
        fontSize: 20,
        fontWeight: '200',
        paddingTop: 10,
    },
    header_text: {
        fontSize: 18,
        fontWeight: '200',
        color: '#455A64'
    },
    normal: {
        fontSize: 16,
        fontWeight: '300',
        paddingTop: 3,
        paddingBottom: 15
    },
    normal2: {
        fontSize: 16,
        fontWeight: '300',
        paddingTop: 2,
        paddingLeft: 5,
    },
})


export default class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this._renderFoodPreferences = this._renderFoodPreferences.bind(this)
    }

    _renderFoodPreferences(foodName, i) {
        return (
            <View index={i}>
                <Icon name='cake'/> 
                <Text>{foodName}</Text>
            </View>
        )
       
    }

    render() {
        var food_arr = this.props.navigation.state.params.foodPreferences
        return (
            <ScrollView style={{backgroundColor: Colors.lightBackground}}>
                <Card
                    image={this.props.navigation.state.params.image}>
                    <Text style={styles.title_text}>
                        {this.props.navigation.state.params.title}
                    </Text>

                    <Text style={styles.description_text}>
                        {this.props.navigation.state.params.details}
                    </Text>

                    
                    
                </Card>
                <Card>
                    <Text style={styles.header_text}>Location</Text>
                    <Text style={styles.normal}>{this.props.navigation.state.params.address}</Text>
                    <Text style={styles.header_text}>Details</Text>
                    <Text style={styles.normal}>{this.props.navigation.state.params.location_details}</Text>
    
                    <Text style={styles.header_text}>Date and Time</Text>
                    <Text style={styles.normal}>{
                        lib._convertDate_getMonthDay(this.props.navigation.state.params.startDate)+'  '+
                        lib._convertHoursMin(this.props.navigation.state.params.startDate)+' ~ '+
                        lib._convertHoursMin(this.props.navigation.state.params.endDate)
                        }
                    </Text>
                
                       
                   
                    <Text style={styles.header_text}>Food Preferences</Text>
                    {
                        
                        this.props.navigation.state.params.foodPreferences.map((obj, i) => {
                            return (
                                <View key={i} style={{
                                    paddingTop: 5,
                                    flexDirection: 'row'
                                    }}>
                                    <Icon 
                                        name='check-circle'
                                        color='#009688'/>
                                    <Text style={styles.normal2}>{obj.name}</Text>
                                </View>
                                
                            
                            )
                        })
                    }
    
                </Card>
                <Button
                        icon={{name: 'done'}}
                        backgroundColor='#03A9F4'
                        style={{paddingTop: 10, paddingBottom: 10}}
                        buttonStyle={{borderRadius: 10}}
                        onPress={
                            () => {
                                console.log('Pressed');
                                return this.props.navigation.goBack(null)
                            }
                            }
                        title='SIGN ME UP' />

                
            </ScrollView>
        )
    }
}

