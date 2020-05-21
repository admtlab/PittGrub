import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { checkGated, hostSignup } from '../api/auth';
import { hostTrainingSlides } from '../api/data';
import { BackButton, PrimaryButton } from '../components/Button';
import Gate from '../components/Gate';
import metrics from '../config/metrics';
import { colors } from '../config/styles';


const { width, height } = Dimensions.get('screen');

@inject('tokenStore', 'userStore')
export default class HostTraining extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          email: PropTypes.string.isRequired,
          password: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          affiliation: PropTypes.string.isRequired,
          reason: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    tokenStore: PropTypes.any.isRequired,
    userStore: PropTypes.any.isRequired,
  };

  static parseMarkdownLinks(text) {
    const re = /\[[\w+\d+0-9 ]+\]\(https?(:\/\/)[^ )]+\.[^)]+\)/g;
    const links = [];
    let res = null;

    // collect regex results
    do {
      res = re.exec(text);
      if (res) {
        links.push(res);
      }
    } while (res);

    return links;
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      activeSlide: 0,
      reachedEnd: false,
      showGate: false,
      trainingSlides: [],
    };

    console.log(props.navigation.state.params);

    this.parseSubtitle = this.parseSubtitle.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }


  componentDidMount() {
    if (!this.state.trainingSlides.length) {
      // make call
      hostTrainingSlides().then(trainingSlides => this.setState({ trainingSlides }));
    }
  }

  createSubtitleLink = (text, url, key) => (
    <Text
      key={key}
      style={{ textDecorationLine: 'underline', textDecorationColor: '#333' }}
      onPress={() => Linking.openURL(url)}
    >
      {text}
    </Text>
  );


  createSubtitleText = (subtitle, start, end, key) => (
    <Text key={key}>{subtitle.substring(start, end)}</Text>
  );

  parseMarkdownLinkText = text => (/\[.+\]/g.exec(text)[0].slice(1, -1));

  parseMarkdownLinkUrl = text => (/\(.+\)/g.exec(text)[0].slice(1, -1));

  snapToItem = index => this.setState(prevState => ({
    activeSlide: index,
    reachedEnd: prevState.reachedEnd || index === prevState.trainingSlides.length - 1,
  }));

  goBack = () => this.props.navigation.goBack();

  submit = () => {
    Keyboard.dismiss();
    this.setState({ loading: true });
    const { email, password, name, affiliation, reason } = this.props.navigation.state.params;
    hostSignup(email, password, name, affiliation, reason, this.props.tokenStore, this.props.userStore)
      .then(this.props.userStore.loadUserProfile)
      .then(() => {
        if (this.props.userStore.account.active) {
          // continue if user account is active
          this.props.navigation.navigate('Main');
        } else {
          this.props.tokenStore.getOrFetchAccessToken()
            .then(checkGated)
            .then(gated => (gated
              ? this.setState({ enableGate: true })
              : this.props.navigation.navigate('Verification')));
        }
      })
      .catch(this.handleError)
      .finally(() => this.setState({ loading: false }));
  }

  handleError = (err) => {
    console.log(err);
    Alert.alert(
      'Error',
      err.status === 400 ? 'Invalid email address.' : 'An error occurred, please try again later.',
      { text: 'OK' },
    );
  }

  parseSubtitle(subtitle) {
    const links = HostTraining.parseMarkdownLinks(subtitle);

    if (!links || !links.length) {
      return (<Text>{subtitle}</Text>);
    }

    return (<Text>{this.convertSubtitle(subtitle, links)}</Text>);
  }

  convertSubtitle(subtitle, links) {
    const elements = [];
    let textKey = 1;

    // add first element if text
    if (links[0].index !== 0) {
      elements.push(
        <Text key={textKey}>
          {this.createSubtitleText(subtitle, 0, links[0].index || subtitle.length)}
        </Text>,
      );
    }

    links.forEach((link, index) => {
      elements.push(
        this.createSubtitleLink(this.parseMarkdownLinkText(link), this.parseMarkdownLinkUrl(link), link.index),
      );
      const next = links[index + 1] ? links[index + 1].index : subtitle.length + 1;
      // eslint-disable-next-line no-plusplus
      elements.push(this.createSubtitleText(subtitle, link.index + link[0].length, next, ++textKey));
    });
    return elements;
  }

  renderItem({ item }) {
    const subtitle = this.parseSubtitle(item.subtitle);
    return (
      <Card title={item.title} titleStyle={{ fontSize: 18 }} image={item.image ? { uri: item.image } : undefined}>
        <Text marginTop={10} marginBottom={5} marginHorizontal={30} style={{ flexDirection: 'row' }}>{subtitle}</Text>
      </Card>
    );
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this.goBack} />;
    }

    return (
      <View backgroundColor={colors.blue} height={height}>
        <View style={{ backgroundColor: colors.blue, alignItems: 'center', width }}>
          <Carousel
            ref={(c) => { this.carousel = c; }}
            data={this.state.trainingSlides}
            renderItem={this.renderItem}
            onSnapToItem={this.snapToItem}
            sliderHeight={width}
            sliderWidth={width}
            itemHeight={120}
            itemWidth={width * 0.9}
            marginTop={20}
            height={400}
          />
          <Pagination
            containerStyle={styles.paginationContainer}
            dotsLength={this.state.trainingSlides.length}
            activeDotIndex={this.state.activeSlide}
            dotColor="rgba(255, 255, 255, 0.92)"
            dotStyle={styles.paginationDot}
            inactiveDotColor="#333"
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this.carousel}
            tappableDots={false}
          />
          <View style={styles.buttonView}>
            <PrimaryButton
              text="CONTINUE"
              onPress={this.submit}
              disabled={!this.state.reachedEnd}
              buttonStyle={styles.buttonAdjuster}
              textStyle={styles.buttonTextAdjuster}
            />
            <BackButton
              onPress={this.goBack}
              buttonStyle={styles.buttonAdjuster}
              textStyle={styles.buttonTextAdjuster}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleDark: {
    color: '#333',
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  paginationContainer: {
    paddingVertical: 20,
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonView: {
    marginTop: metrics.iPhoneType === '-' ? -30 : metrics.iPhoneType === 'SE' ? -45 : 0,
  },
  buttonAdjuster: {
    backgroundColor: colors.theme,
    borderRadius: 25,
    marginTop: metrics.iPhoneType === 'SE' ? 10 : 20,
    width: metrics.iPhoneType === 'SE' ? Dimensions.get('window').width - 120 : Dimensions.get('window').width - 100,
    height: metrics.iPhoneType === 'SE' ? 35 : 50,
  },
  buttonTextAdjuster: {
    fontSize: metrics.iPhoneType === 'SE' ? 12 : Dimensions.get('window').width / 21,
  },
});
