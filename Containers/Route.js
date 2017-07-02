import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from './Home'
import Events from './Events'
import CreateEvent from './CreateEvent'
import EventDetail from './EventDetail'
import Profile from './Profile'
import Metrics from '../Styles/Metrics'

export const HomeNav = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
      header: false
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
      title: 'Events'
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
      tabBarIcon: ({ tintColor }) => <Icon name="home" size={Metrics.tabBarIconHeight} color={tintColor} />,
      
    },
  },
  EventsTab: {
    screen: EventNav,
    navigationOptions: {
      tabBarLabel: 'Events',
      tabBarIcon: ({ tintColor }) => <Icon name="event-note" size={Metrics.tabBarIconHeight} color={tintColor} />,
  },
  },
  ProfileTab: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={Metrics.tabBarIconHeight} color={tintColor} />,
    }
  }
  }, {
    tabBarOptions: {
      style: {
        height: Metrics.tabBarHeight
      }
    },
});
