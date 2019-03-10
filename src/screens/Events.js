import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import { Icon, ListItem, SearchBar } from 'react-native-elements';
import { Header } from 'react-navigation';
import { parseDateRange } from '../common/time';
import metrics from '../config/metrics';
import { colors, globalStyles } from '../config/styles';


const { height } = Dimensions.get('window');


@inject('eventStore', 'userStore')
@observer
export default class Events extends Component {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
    eventStore: PropTypes.any.isRequired,
    userStore: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      searchText: '',
    };

    this.viewEvent = this.viewEvent.bind(this);
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.eventStore.fetchEvents();
    this.setState({ refreshing: false });
  }

  createEvent = () => {
    this.props.navigation.navigate('CreateEvent');
  }

  viewEvent = (event) => {
    this.props.navigation.navigate('EventDetails', { event });
  }

  eventKeyExtractor = event => String(event.id);

  renderEvent = ({ item }) => {
    if (!this.state.searchText.length
        || item.title.toLocaleLowerCase().includes(this.state.searchText.toLocaleLowerCase())) {
      return (
        <TouchableOpacity style={styles.eventItem} onPress={() => this.viewEvent(item)}>
          <ListItem
            key={item.id}
            title={item.title}
            subtitle={parseDateRange(item.start_date, item.end_date)}
            subtitleStyle={{ paddingTop: 5 }}
          />
        </TouchableOpacity>
      );
    }
    return <View />;
  }

  renderEmptyList = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyText}>
        No events found
      </Text>
    </View>
  );

  _clearSearch = () => Keyboard.dismiss();

  searchEvents = searchText => this.setState({ searchText });

  render() {
    const { userStore } = this.props;

    return (
      <SafeAreaView styles={globalStyles.container}>
        <StatusBar containerStyle={{ minHeight: 80 }} hidden={false} />
        <SearchBar
          ref={(search) => { this.search = search; }}
          placeholder="Search events..."
          value={this.state.searchText}
          onChangeText={this.searchEvents}
          onClear={Keyboard.dismiss}
          onTouchCancel={Keyboard.dismiss}
          onCancel={Keyboard.dismiss}
          clearIcon={{ color: '#86939E', name: 'clear' }}
          containerStyle={{ backgroundColor: '#eee' }}
          lightTheme
          inputStyle={{ color: colors.text }}
        />
        <FlatList
          data={this.props.eventStore.events.slice()}
          keyExtractor={this.eventKeyExtractor}
          renderItem={this.renderEvent}
          ListEmptyComponent={this.renderEmptyList}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          keyboardShouldPersistTaps="handled"
          style={styles.eventList}
        />
        {(userStore.isHost || userStore.isAdmin) && (
          <ActionButton
            style={{ marginBottom: 20 }}
            buttonColor={colors.red}
          >
            <ActionButton.Item
              title="Create Event"
              onPress={this.createEvent}
              buttonColor={colors.blue}
            >
              <Icon
                name="md-create"
                type="ionicon"
                color="white"
                style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
          </ActionButton>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  eventList: {
    backgroundColor: colors.Background,
    minHeight: height - metrics.tabBarHeight - Header.HEIGHT - 50,
    maxHeight: height - metrics.tabBarHeight - Header.HEIGHT - 50,
  },
  eventItem: {
    backgroundColor: 'snow',
  },
  emptyList: {
    height: height - metrics.tabBarHeight,
    marginHorizontal: 15,
  },
  emptyText: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    color: colors.text,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
