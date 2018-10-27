import { colors, globalStyles } from '../config/styles';
import { parseDateRange } from '../lib/time';
import { inject, observer } from 'mobx-react';
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
  View
} from 'react-native';
import { Icon, ListItem, SearchBar } from 'react-native-elements';
import { Header } from 'react-navigation';
import metrics from '../config/metrics';
import ActionButton from 'react-native-action-button';


const { height } = Dimensions.get('window');


@inject('eventStore', 'userStore')
@observer
export default class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      loading: false,
      searchText: '',
      // data: [],
      // data: [
      //   {key: '1', name: 'Foo1'},
      //   {key: '2', name: 'Foo2'},
      //   {key: '3', name: 'Foo3'},
      //   {key: '4', name: 'Foo4'},
      //   {key: '5', name: 'Foo5'},
      //   {key: '6', name: 'Foo6'},
      // ],
      data: [
        {
          id: 4,
          title: 'Great Pizza for Everyone',
          description: 'Free pizza at the William Pitt Union!',
          address: '500 Grant Street',
          location: '12th Floor Conference Room',
          start_date: new Date(),
          end_date: new Date(),
          food_preferences: [
            { id: 1, name: 'Gluten Free' },
            { id: 2, name: 'Dairy Free' },
            { id: 3, name: 'Vegetarian' },
            { id: 4, name: 'Vegan' },
          ],
          accepted: false,
        },
      ],
      listData: []
    };

    this._viewEvent = this._viewEvent.bind(this);
  }

  componentDidMount() {
    this.setState({ listData: this.state.data });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.eventStore.fetchEvents();
    this.setState({ refreshing: false });
  }

  _fetchEvents = async () => {
    console.log('fetching events from events page...');
  }

  createEvent = () => {
    console.log('creating event ...');
    this.props.navigation.navigate('CreateEvent');
  }

  _viewEvent = (event) => {
    this.props.navigation.navigate('EventDetails', { event });
  }

  _eventKeyExtractor = (event) => String(event.id);

  _renderEvent = ({ item }) => {
    return (
      <TouchableOpacity style={styles.eventItem} onPress={() => this._viewEvent(item)}>
        <ListItem
          key={item.id}
          title={item.title}
          subtitle={parseDateRange(item.start_date, item.end_date)}
          subtitleStyle={{ paddingTop: 5 }}
        />
      </TouchableOpacity>
    );
    // console.log(`searching for item ${JSON.stringify(item.name.toLocaleLowerCase())}`);
    // console.log(item);
    // if (!this.state.searchText.length || item.name.toLocaleLowerCase().includes(this.state.searchText.toLocaleLowerCase())) {
    //   return (
    //   );
    // }
    // return <View/>;
  }

  _renderEmptyList = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyText}>
        No events found
      </Text>
    </View>
  );

  _clearSearch = () => Keyboard.dismiss();

  _searchEvents = (text) => {
    this.setState({
      searchText: text,
      listData: this.state.data.filter(item => item.title.includes(text))
    });
  }

  render() {
    const { userStore } = this.props;
    console.log('events rendering...');
    
    return (
      <SafeAreaView styles={globalStyles.container}>
        <StatusBar containerStyle={{ minHeight: 80}}  hidden={false} />
        <SearchBar
          ref={search => this.search = search}
          placeholder='Search events...'
          value={this.state.searchText}
          onChangeText={this._searchEvents}
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
          keyExtractor={this._eventKeyExtractor}
          renderItem={this._renderEvent}
          ListEmptyComponent={this._renderEmptyList}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
          keyboardShouldPersistTaps='handled'
          style={styles.eventList}
        />
        {(userStore.isHost || userStore.isAdmin) && (
          <ActionButton
            style={{ marginBottom: metrics.tabBarHeight }}
            buttonColor={colors.red}
          >
            <ActionButton.Item
              title='Create Event'
              onPress={this.createEvent}
              buttonColor={colors.blue}
            >
              <Icon
                name='md-create'
                type='ionicon'
                color='white'
                style={styles.actionButtonIcon} />
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
    minHeight: height - metrics.tabBarHeight - Header.HEIGHT,
    maxHeight: height - metrics.tabBarHeight - Header.HEIGHT,
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
