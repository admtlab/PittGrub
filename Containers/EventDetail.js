import React from 'react';

import {View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import { Card, Button, FormLabel } from 'react-native-elements'
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
    }
})


export default class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <ScrollView style={{backgroundColor: Colors.lightBackground}}>
                <Card
                    image={Images.kitchen}>
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
                    <Text style={styles.header_text}>Date & Time</Text>
                    <Text style={styles.normal}>{lib._convertDate(this.props.navigation.state.params.startDate)}</Text>
                    <Text style={styles.header_text}>Food Options</Text>
                    
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

