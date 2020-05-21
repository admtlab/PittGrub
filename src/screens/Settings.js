import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Linking,
  Platform,
  SectionList,
  SafeAreaView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { handleError } from '../common/util';
import PittGrubConstants from '../config/constants';
import { colors, globalStyles } from '../config/styles';
import { supportEmail } from '../config/templates';

@inject('tokenStore', 'userStore')
@observer
export default class Settings extends Component {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
    tokenStore: PropTypes.any.isRequired,
    userStore: PropTypes.any.isRequired,
  };

  settings = () => {
    const settings = [
      {
        title: '\n',
        data: [
          { title: 'Profile', action: this.profileAction },
          { title: 'Logout', action: this.logout },
        ],
      }, {
        title: '\n',
        data: [
          { title: 'Share', action: this.shareAction },
          { title: this.rateAppTitle(), action: this.rateAppAction },
        ],
      }, {
        title: '\n',
        data: [
          { title: 'About', action: this.aboutAction },
          { title: 'Disclaimer', action: this.disclaimerAction },
          { title: 'Support', action: this.supportAction },
        ],
      },
    ];

    if (this.props.userStore.isHost) {
      // IF MORE SETTINGS ARE ADDED, VERIFY THIS INDEX
      settings[2].data.push({ title: 'Host Training', action: this.hostTrainingAction });
    }

    return settings;
  }

  profileAction = () => this.props.navigation.navigate('ProfileSettings');

  rateAppTitle = () => `Rate on ${Platform.OS === 'android' ? 'Google Play' : 'App Store'}`;

  rateAppAction = () => Linking.openURL(this.appStoreLink()).catch(e => handleError(e));

  aboutAction = () => this.props.navigation.navigate('About');

  disclaimerAction = () => Linking.openURL(PittGrubConstants.DISCLAIMER_URL).catch(e => handleError(e));

  supportAction = () => Linking.openURL(this.supportEmailUrl()).catch(e => handleError(e));

  supportEmailUrl = () => `mailto:${PittGrubConstants.SUPPORT_EMAIL}`
  + `?subject=PittGrub%20User%20Support&body=${encodeURIComponent(supportEmail(this.props.userStore.account.id))}`;

  appStoreLink = () => `itms-apps://itunes.apple.com/us/app/id${PittGrubConstants.APPLE_ID}?mt=8`;

  shareAction = async () => {
    const subject = 'PittGrub | Free food at the University of Pittsburgh';
    const message = 'Check out PittGrub to find free food events at the University of Pittsburgh! Download the app at '
    + `${this.appStoreLink()} or go to ${encodeURI(PittGrubConstants.WEBSITE_URL)} to learn more.`;
    Share.share({ message }, { subject, dialogTitle: subject }).catch(e => handleError(e));
  }

  hostTrainingAction = () => this.props.navigation.navigate('HostTrainingReview');

  logout = () => {
    const { tokenStore, userStore } = this.props;
    tokenStore.clearTokens();
    userStore.clearUser();
    this.props.navigation.navigate('Entrance');
  }

  keyExtractor = (_, index) => String(index);

  renderItem = ({ item, index }) => {
    const color = item.title === 'Logout' ? colors.red : 'black';
    return (
      <TouchableOpacity style={styles.item} onPress={() => item.action()}>
        <ListItem key={index} title={item.title} titleStyle={{ color }} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={globalStyles.container}>
        <StatusBar containerStyle={{ minHeight: 80 }} hidden={false} />
        <SectionList
          sections={this.settings().slice()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'snow',
  },
});
