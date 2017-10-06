import React from 'react';
import { AppRegistry } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Home from './Home'
import Events from './Events'
import LoginScreen from './Login'
import Welcome from './Welcome';
import Verification from './Verification';
import Waiting from './Waiting';
import Signup from './Signup';
import CreateEvent from './CreateEvent'
import EventDetail from './EventDetail'
import Profile from './Profile'
import Metrics from '../config/metrics'


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
          size={Metrics.tabBarIconHeight}
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
          size={Metrics.tabBarIconHeight}
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
          size={Metrics.tabBarIconHeight}
          color={tintColor}
        />,
    }
  }}, {
    // initialRouteName: 'ProfileTab'
  }, {
    tabBarOptions: {
      style: {
        height: Metrics.tabBarHeight
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
      header: false
    }
  }}, {
    initialRouteName: 'Entrance'
  });

export class AppScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  _onNavigationStateChange = (prevState, newState) => {
    this.setState({...this.state, route_index: newState.index});
  }

  render() {
    return(
      <AppNav 
        onNavigationStateChange = {(prevState, newState) => {
          this._onNavigationStateChange(prevState, newState);
        }}
        screenProps = { this.state }
      />
    );
  };
}



// export default () =>
//   <Tabs
//     ref={(ref) => { this.nav = ref; }}
//     onNavigationStateChange={(prevState, currState) => {
//       console.log("STATE SWITCH");
//       const getCurrentRouteName = (navigationState) => {
//         console.log("getting current route name")
//         if (!navigationState) return null;
//         const route = navigationState.routes[navigationState.index];
//         if (route.routes) return getCurrentRouteName(route);
//         return route.routeName;
//       };
//       global.currentRoute = getCurrentRouteName(currentState);
//     }}
//   />;
