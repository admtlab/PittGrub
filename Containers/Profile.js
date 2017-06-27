import React from 'react'
import { Switch, ScrollView, Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import Metrics from '../Styles/Metrics'
import Colors from '../Styles/Colors'
import Images from '../Styles/Images'
import { FormLabel } from 'react-native-elements'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: 'bold',


    }
});

class Profile extends React.Component {
    render() {
        return (
            <ScrollView>
               <FormLabel labelStyle={styles.title}> Food Preferences </FormLabel>
               <View>
                   <Switch/>
                   <Switch/>
                   <Switch/>
                   <Switch/>
               </View>

            </ScrollView>
        )
           
        
    }
}

export default Profile;