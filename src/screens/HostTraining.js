import { checkGated, hostSignup } from '../api/auth';
import { colors } from '../config/styles';
import { BackButton, PrimaryButton } from '../components/Button';
import Gate from '../components/Gate';
import { inject } from 'mobx-react';
import React, { PureComponent } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Linking,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Card } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import images from '../config/images';
import metrics from '../config/metrics';


const { width, height } = Dimensions.get('screen');


function wp (percentage) {
  return Math.round((percentage * width) / 100);
}

const multiplier = function() {
  const type = metrics.iPhoneType;
  if (type === '-') {
    return 5;
  } else if (type === 'SE') {
    return 7;
  } else {
    return 2;
  }
}();
const itemHorizontalMargin = wp(2);
const slideHeight = height * 0.36;
const sliderWidth = width;
const slideWidth = wp(75);
const itemWidth = slideWidth + itemHorizontalMargin * multiplier;

@inject('tokenStore', 'userStore')
export default class HostTraining extends PureComponent {
  static TrainingComponents = [
    {
      title: 'Food Storage',
      subtitle: 'Please store your food safely! Food should be stored at a safe temperature, and covered and protected from the elements.',
      image: images.logo,
    }, {
      title: 'Food Handling',
      subtitle: 'Please handle your food safely',
      image: images.background,
    }, {
      title: 'Have Fun',
      subtitle: 'We hope you enjoy using PittGrub!',
      image: images.logo,
    }, {
      title: 'Agreement',
      subtitle: (
        <View>
          <Text>By clicking "Continue" you agree to the terms and conditions of hosting food on PittGrub.{' '}
            <Text onPress={() => Linking.openURL('https://pittgrub.com')} style={{textDecorationLine: 'underline', textDecorationColor: '#333'}}>
              Review PittGrub's terms and conditions.
            </Text>
          </Text>
        </View>
      ),
      image: images.logo,
    }
  ];

  state = {
    loading: false,
    activeSlide: 0,
    reachedEnd: false,
    showGate: false,
  };
 
  _renderItem ({ item }) {
    return (
      <Card title={item.title} titleStyle={{fontSize: 18}} style={{alignItems: 'center', alignContent: 'center'}}>
        <Image source={item.image} style={{width: 180, height: 180, marginHorizontal: 20}} />
        <View marginTop={10} marginBottom={5} marginHorizontal={30}>
          <Text>{item.subtitle}</Text>
        </View>
      </Card>
    );
  }

  snapToItem = (index) => this.setState({ activeSlide: index, reachedEnd: this.state.reachedEnd || index === HostTraining.TrainingComponents.length - 1 })

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
        this.props.navigation.navigate('Main')
      } else {
        this.props.tokenStore.getOrFetchAccessToken()
        .then(checkGated)
        .then(gated => gated ? this.setState({ enableGate: true }) : this.props.navigation.navigate('Verification'));
      }
    })
    .catch(this._handleError)
    .finally(() => this.setState({ loading: false }));
  }

  _handleError = (err) => {
    console.log(err);
    Alert.alert(
      'Error',
      err.status === 400 ? 'Invalid email address.' : 'An error occurred, please try again later.',
      { text: 'OK' }
    );
  }

  render() {
    // show gate
    if (this.state.enableGate) {
      return <Gate back={this.goBack} />;
    }

    return (
      <View backgroundColor={colors.blue} height={height}>
        <View style={{backgroundColor: colors.blue, alignItems: 'center', width: width}}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={HostTraining.TrainingComponents}
            renderItem={this._renderItem}
            onSnapToItem={this.snapToItem}
            sliderHeight={sliderWidth}
            sliderWidth={sliderWidth}
            itemHeight={40}
            itemWidth={itemWidth}
            marginTop={20}
            height={400}
          />
          <Pagination
            containerStyle={styles.paginationContainer}
            dotsLength={HostTraining.TrainingComponents.length}
            activeDotIndex={this.state.activeSlide}
            dotColor={'rgba(255, 255, 255, 0.92)'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'#333'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={false}
            carouselRef={this._carousel}
            tappableDots={!!this._carousel}
          />
          <View style={styles.buttonView}>
            <PrimaryButton disabled={!this.state.reachedEnd} text='CONTINUE' onPress={this.submit} buttonStyle={styles.buttonAdjuster} textStyle={styles.buttonTextAdjuster} />
            <BackButton onPress={this.goBack} buttonStyle={styles.buttonAdjuster} textStyle={styles.buttonTextAdjuster} />
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
      textAlign: 'center'
  },
  titleDark: {
      color: '#333'
  },
  subtitle: {
      marginTop: 5,
      paddingHorizontal: 30,
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.75)',
      fontSize: 13,
      fontStyle: 'italic',
      textAlign: 'center'
  },
  paginationContainer: {
      paddingVertical: 20,
      marginBottom: 30
  },
  paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 8
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
    fontSize: metrics.iPhoneType === 'SE' ? 12: Dimensions.get('window').width / 21
  }
});
