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


const { width, height } = Dimensions.get('window');


function wp (percentage) {
  return Math.round((percentage * width) / 100);
}

const itemHorizontalMargin = wp(2);
const slideHeight = height * 0.36;
const sliderWidth = width;
const slideWidth = wp(75);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

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
      <Card title={item.title} titleStyle={{fontSize: 20}} style={{alignItems: 'center', alignContent: 'center'}}>
        <Image source={item.image} style={{width: 220, height: 220, marginHorizontal: 20}} />
        <View marginTop={40} marginBottom={20} marginHorizontal={30}>
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
    const { email, password, name, affiliation, directory, reason } = this.props.navigation.state.params;
    hostSignup(email, password, name, affiliation, directory, reason, this.props.tokenStore, this.props.userStore)
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

    console.log(this.props.navigation.state.params);
    console.log(this.state);

    return (
      <View backgroundColor={colors.blue} height={height}>
        <View style={{backgroundColor: colors.blue, alignItems: 'center', width: width}}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={HostTraining.TrainingComponents}
            renderItem={this._renderItem}
            onSnapToItem={this.snapToItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            marginTop={40}
            height={450}
          />
          <Pagination
            dotsLength={HostTraining.TrainingComponents.length}
            activeDotIndex={this.state.activeSlide}
            dotColor={'rgba(255, 255, 255, 0.92)'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'#333'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this._carousel}
            tappableDots={!!this._carousel}
          />
          <PrimaryButton disabled={!this.state.reachedEnd} text='Continue' onPress={this.submit} />
          <BackButton onPress={this.goBack} />
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
      paddingVertical: 8
  },
  paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 8
  },
});
