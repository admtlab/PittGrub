import React from 'react';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import CreateEvent from '../screens/CreateEvent';
import Entrance from '../screens/Entrance';
import Events from '../screens/Events';
import EventDetails from '../screens/EventDetails';
import Login from '../screens/Login';
import Home from '../screens/Home';
import HostSignup from '../screens/HostSignup';
import HostTraining from '../screens/HostTraining';
import PasswordReset from '../screens/PasswordReset';
import Settings from '../screens/Settings';
import Signup from '../screens/Signup';
import Verification from '../screens/Verification';


const fade = ({ position, scene }) => {
  const index = scene.index;
  const opacity = position.interpolate({
      inputRange: [index - 0.7, index, index + 0.7],
      outputRange: [0.3, 1, 0.3]
  });

  return {
    opacity,
    transform: [{ translateX: 0 }, { translateY: 0 }]
  };
}

const EntryNav = createStackNavigator({
  Entrance: { screen: Entrance },
  Login: { screen: Login },
  HostSignup: { screen: HostSignup },
  HostTraining: { screen: HostTraining },
  PasswordReset: { screen: PasswordReset },
  Signup: { screen: Signup },
  Verification: { screen: Verification },
  }, {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    },
    transitionConfig: () => ({
      screenInterpolator: (props) => {
        return fade(props);
      }
    })
  }
);

const HomeNav = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => ({
      headerTitle: 'PittGrub',
      headerTitleStyle: {
        fontSize: 22
      },
      headerBackTitle: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={30} color={tintColor} />
    })
  },
  EventDetails: {
    screen: EventDetails,
    navigationOptions: () => ({
      title: 'Event Details',
      headerTitleStyle: {
        fontSize: 22
      },
    })
  },
});

const EventNav = createStackNavigator({
  Events: {
    screen: Events,
    navigationOptions: () => ({
      title: 'Events',
      headerTitleStyle: {
        fontSize: 22
      },
    })
  },
  EventDetails: {
    screen: EventDetails,
    navigationOptions: () => ({
      title: 'Event Details',
      headerTitleStyle: {
        fontSize: 22
      },
    })
  },
  CreateEvent: {
    screen: CreateEvent,
    navigationOptions: () => ({
      title: 'Create Event',
      headerTitleStyle: {
        fontSize: 22
      },
    })
  },
});

const SettingsNav = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: () => ({
      title: 'Settings',
      headerTitleStyle: {
        fontSize: 22
      },
    })
  },
});

const MainNav = createBottomTabNavigator({
  HomeTab: {
    screen: HomeNav,
    navigationOptions: () => ({
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={30} color={tintColor} />,
    })
  },
  EventTab: {
    screen: EventNav,
    navigationOptions: () => ({
      tabBarLabel: 'Events',
      tabBarIcon: ({ tintColor }) => <Icon name='event-note' size={30} color={tintColor} />,
    })
  },
  SettingsTab: {
    screen: SettingsNav,
    navigationOptions: () => ({
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => <Icon name='account-circle' size={30} color={tintColor} />,
    })
  },
});

const AppNav = createStackNavigator({
  Entrance: { screen: EntryNav },
  Main: { screen: MainNav },
  }, {
    headerMode: 'none',
    initialRouteName: 'Entrance',
    navigationOptions: {
      gesturesEnabled: false
    },
    transitionConfig: () => ({
      screenInterpolator: (props) => {
        return fade(props);
      }
    })
  },
);


export default AppNav;
