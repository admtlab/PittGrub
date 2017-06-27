import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from './Home'
import Events from './Events'
import CreateEvent from './CreateEvent'
import EventDetail from './EventDetail'
import Profile from './Profile'

export const HomeNav = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home'
    }
  },
  EventDetail: {
    screen: EventDetail,
    navigationOptions: ({navigation}) => ({
      title: `Event Details`,
    })
  },
})

export const EventNav = StackNavigator({
  Events: {
    screen: Events,
    navigationOptions: {
      title: 'All Events',
    },
  },
  CreateEvent: {
    screen: CreateEvent,
    navigationOptions: {
      title: 'Create Event'
    }
  },
  EventDetail: {
    screen: EventDetail,
    navigationOptions: ({navigation}) => ({
      title: 'Event Details'
    })
  }
})

export const Tabs = TabNavigator({
  HomeTab: {
    screen: HomeNav,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name="home" size={35} color={tintColor} />,
      
    },
  },
  EventsTab: {
    screen: EventNav,
    navigationOptions: {
      tabBarLabel: 'Events',
      tabBarIcon: ({ tintColor }) => <Icon name="event-note" size={35} color={tintColor} />,
  },
  },
  ProfileTab: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={35} color={tintColor} />,
    }
  }
  }, {
    tabBarOptions: {
      style: {
        paddingTop: 10,
        height: 60
      }
    },
  
});
