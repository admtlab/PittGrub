import React from 'react';
import { Icon } from 'react-native-elements';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import About from '../screens/About';
import CreateEvent from '../screens/CreateEvent';
import Entrance from '../screens/Entrance';
import Events from '../screens/Events';
import EventDetails from '../screens/EventDetails';
import FoodPreferenceSettings from '../screens/FoodPreferenceSettings';
import Login from '../screens/Login';
import Home from '../screens/Home';
import HostSignup from '../screens/HostSignup';
import HostTraining from '../screens/HostTraining';
import HostTrainingReview from '../screens/HostTrainingReview';
import PasswordReset from '../screens/PasswordReset';
import ProfileSettings from '../screens/ProfileSettings';
import Settings from '../screens/Settings';
import Signup from '../screens/Signup';
import Verification from '../screens/Verification';


const fade = ({ position, scene }) => {
  const { index } = scene;
  const opacity = position.interpolate({
    inputRange: [index - 0.7, index, index + 0.7],
    outputRange: [0.3, 1, 0.3],
  });

  return {
    opacity,
    transform: [{ translateX: 0 }, { translateY: 0 }],
  };
};

const headerTitleStyle = { fontSize: 22 };

// eslint-disable-next-line react/prop-types
function tabBarIcon({ tintColor }, name) {
  return <Icon name={name} size={30} color={tintColor} />;
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
    gesturesEnabled: false,
  },
  transitionConfig: () => ({
    screenInterpolator: props => fade(props),
  }),
});

const HomeNav = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => ({
      headerTitle: 'PittGrub',
      headerTitleStyle,
      headerBackTitle: 'Home',
      tabBarIcon: i => tabBarIcon(i, 'home'),
    }),
  },
  EventDetails: {
    screen: EventDetails,
    navigationOptions: () => ({
      title: 'Event Details',
      headerTitleStyle,
    }),
  },
});

const EventNav = createStackNavigator({
  Events: {
    screen: Events,
    navigationOptions: () => ({
      title: 'Events',
      headerTitleStyle,
    }),
  },
  EventDetails: {
    screen: EventDetails,
    navigationOptions: () => ({
      title: 'Event Details',
      headerTitleStyle,
    }),
  },
  CreateEvent: {
    screen: CreateEvent,
    navigationOptions: () => ({
      title: 'Create Event',
      headerTitleStyle,
    }),
  },
});

const SettingsNav = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: () => ({
      title: 'Settings',
      headerTitleStyle,
    }),
  },
  About: {
    screen: About,
    navigationOptions: () => ({
      title: 'About',
      headerTitleStyle,
    }),
  },
  ProfileSettings: {
    screen: ProfileSettings,
    navigationOptions: () => ({
      title: 'Profile Settings',
      headerTitleStyle,
    }),
  },
  FoodPreferenceSettings: {
    screen: FoodPreferenceSettings,
    navigationOptions: () => ({
      title: 'Food Preference Settings',
      headerTitleStyle,
    }),
  },
  HostTrainingReview: { screen: HostTrainingReview },
});

const MainNav = createBottomTabNavigator({
  HomeTab: {
    screen: HomeNav,
    navigationOptions: () => ({
      tabBarLabel: 'Home',
      tabBarIcon: i => tabBarIcon(i, 'home'),
    }),
  },
  EventTab: {
    screen: EventNav,
    navigationOptions: () => ({
      tabBarLabel: 'Events',
      tabBarIcon: i => tabBarIcon(i, 'event-note'),
    }),
  },
  SettingsTab: {
    screen: SettingsNav,
    navigationOptions: () => ({
      tabBarLabel: 'Settings',
      tabBarIcon: i => tabBarIcon(i, 'account-circle'),
    }),
  },
});

const AppNav = createStackNavigator({
  Entrance: { screen: EntryNav },
  Main: { screen: MainNav },
}, {
  headerMode: 'none',
  initialRouteName: 'Entrance',
  navigationOptions: {
    gesturesEnabled: false,
  },
  transitionConfig: () => ({
    screenInterpolator: props => fade(props),
  }),
});


export default AppNav;
