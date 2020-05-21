import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { Header } from 'react-navigation';
import { parseDateRange } from '../common/time';
import metrics from '../config/metrics';
import { colors, globalStyles } from '../config/styles';


const { height } = Dimensions.get('window');


@inject('eventStore')
@observer
export default class Home extends Component {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
    eventStore: PropTypes.any.isRequired,
  };
  static interval = null;

  state = {
    refreshing: false,
  };

  componentDidMount() {
    this.onRefresh();
  }

  goToEvents = () => {
    this.props.navigation.navigate('Events');
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.eventStore.fetchEvents();
    this.setState({ refreshing: false });
  }

  viewEvent = (event) => {
    this.props.navigation.navigate('EventDetails', { event });
  }

  eventKeyExtractor = event => String(event.id);

  renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.sectionItem} onPress={() => this.viewEvent(item)}>
      <ListItem
        key={item.id}
        title={item.title}
        subtitle={parseDateRange(item.start_date, item.end_date)}
        subtitleStyle={{ paddingTop: 5 }}
      />
    </TouchableOpacity>
  );

  renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{`${section.title}`}</Text>
    </View>
  );

  renderEmptyList = () => (
    <View style={styles.emptyList}>
      <Text style={{ fontSize: 20, paddingTop: 30 }}>
        {"You have not signed up for any events yet. Check out what's happening!"}
      </Text>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.eventButton} onPress={this.goToEvents}>
          <Icon name="event-note" size={150} color={colors.softWhite} marginHorizontal={30} marginTop={10} />
          <Text style={{ fontSize: 20, marginBottom: 10, color: colors.softWhite }}>Go to events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    return (
      <SafeAreaView styles={globalStyles.container}>
        <StatusBar containerStyle={{ minHeight: 80 }} hidden={false} />
        <SectionList
          renderItem={this.renderEvent}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.props.eventStore.eventSections}
          keyExtractor={this.eventKeyExtractor}
          ListEmptyComponent={this.renderEmptyList}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          style={styles.sectionList}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionList: {
    minHeight: height - metrics.tabBarHeight - Header.HEIGHT,
    maxHeight: height - metrics.tabBarHeight - Header.HEIGHT,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: colors.blue,
  },
  sectionTitle: {
    color: colors.softWhite,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
  },
  sectionItem: {
    backgroundColor: 'snow',
  },
  emptyList: {
    height: height - metrics.tabBarHeight,
    marginHorizontal: 15,
  },
  emptyText: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.softWhite,
  },
  eventButton: {
    borderRadius: 25,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: 'tomato',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
});
