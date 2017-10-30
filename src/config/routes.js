/* @flow */

import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { Icon } from 'react-native-elements';
import CreateEvent from '../containers/CreateEvent';
import Events from '../containers/Events'
import EventDetail from '../containers/EventDetail';
import Home from '../containers/Home';
import LoginScreen from '../containers/Login';
import PasswordReset from '../containers/PasswordReset';
import Profile from '../containers/Profile';
import Signup from '../containers/Signup';
import Verification from '../containers/Verification';
import Waiting from '../containers/Waiting';
import Welcome from '../containers/Welcome';
import metrics from './metrics';


const StackNavigatorConfig = {
  transitionConfig: () => {
    return {
      screenInterpolator: CardStackStyleInterpolator.forInitial
    }
  }
  // transitionConfig: () => ({
  // 	transitionSpec: {
  // 		duration: 0,
  // 		timing: Animated.timing,
  // 		easing: Easing.step0,
  // 	},
  // }),
};

export const HomeNav = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions:({navigation}) => ({
      title: 'PittGrub',
      headerBackTitle: 'Home',
    })
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
});

export const WelcomeNav = StackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      title: 'Enter',
      header: false,
    }
  },
  Signup: {
    screen: Signup,
    navigationOptions: {
      title: 'Signup',
      header: false,
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Login',
      header: false,
    }
  },
  PasswordReset: {
    screen: PasswordReset,
    navigationOptions: {
      title: 'Password Reset',
      header: false,
    }
  },
  Verification: {
    screen: Verification,
    navigationOptions: {
      title: 'Verification',
      header: false,
    }
  },
  Waiting: {
    screen: Waiting,
    navigationOptions: {
      title: 'Pending',
      header: false,
    }
  }
});

export const TabNav = TabNavigator({
  HomeTab: {
    screen: HomeNav,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) =>
        <Icon
          name="home"
          size={metrics.tabBarIconHeight}
          color={tintColor}
        />,
    },
  },
  EventsTab: {
    screen: EventNav,
    navigationOptions: {
      tabBarLabel: 'Events',
      tabBarIcon: ({ tintColor }) =>
        <Icon
          name="event-note"
          size={metrics.tabBarIconHeight}
          color={tintColor}
        />,
    },
  },
  ProfileTab: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) =>
        <Icon
          name="account-circle"
          size={metrics.tabBarIconHeight}
          color={tintColor}
        />,
    }
  }}, {
    initialRouteName: 'HomeTab',
  }, {
    tabBarOptions: {
      style: {
        height: metrics.tabBarHeight
      }
    },
  },
);

export const AppNav = StackNavigator({
  Entrance: {
    screen: WelcomeNav,
    navigationOptions: {
      header: false
    }
  },
  Main: {
    screen: TabNav,
    navigationOptions: {
      header: false,
      gesturesEnabled: false
    }
  }}, {
    initialRouteName: 'Entrance',
});

export default AppNav;
