import { colors } from '../config/styles';
import { SliderEntry } from '../components/Slider';
import { PrimaryButton } from '../components/Button';
import React, { PureComponent } from 'react';
import {
  Dimensions,
  Image,
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


export default class HostTraining extends PureComponent {
  static TrainingComponents = [
    {
      title: 'Food Storage',
      subtitle: 'Please store your food safely! Food should be stored at a safe temperature, and covered and protected from the elements.',
      image: images.logo
    }, {
      title: 'Food Handling',
      subtitle: 'Please handle your food safely',
      image: images.background
    }, {
      title: 'Have Fun',
      subtitle: 'We hope you enjoy using PittGrub!',
      image: images.logo
    }
  ];

  state = {
    activeSlide: 1
  };
 
  _renderItemWithParallax ({item, index}, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }
 
  _renderItem ({item, index}) {
    return (
      <Card title={item.title} titleStyle={{fontSize: 20}} style={{alignItems: 'center', alignContent: 'center'}}>
        <Image source={item.image} style={{width: 220, height: 220, marginHorizontal: 20}} />
        <View marginTop={40} marginBottom={20} marginHorizontal={30}>
          <Text>{item.subtitle}</Text>
        </View>
      </Card>
    );
  }

  mainExample (number, title) {
    const { slider1ActiveSlide } = this.state;

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.title}>{`Example ${number}`}</Text>
        <Text style={styles.subtitle}>{title}</Text>
        <Carousel
          ref={c => this._slider1Ref = c}
          data={HostTraining.TrainingComponents}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={1}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
        />
        <Pagination
          dotsLength={HostTraining.TrainingComponents.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'rgba(255, 255, 255, 0.92)'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={'#333'}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
        />
      </View>
    );
  }

  goBack = () => this.props.navigation.goBack();

  render() {
    return (
      <View style={{backgroundColor: colors.blue, flex: 1, flexDirection: 'column', alignItems: 'center', width: width, height: 600}}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={HostTraining.TrainingComponents}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          marginTop={40}
          height={400}
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
        <PrimaryButton text='Continue' onPress={() => this.props.navigation.navigate('Verification')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#333'
  },
  container: {
      flex: 1,
      backgroundColor: colors.blue
  },
  gradient: {
      ...StyleSheet.absoluteFillObject
  },
  scrollview: {
      flex: 1
  },
  exampleContainer: {
      paddingVertical: 30
  },
  exampleContainerDark: {
      backgroundColor: '#333'
  },
  exampleContainerLight: {
      backgroundColor: 'white'
  },
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
  slider: {
      marginTop: 15,
      overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
      paddingVertical: 10 // for custom animation
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
