import { Constants } from 'expo';
import { Dimensions, StyleSheet } from 'react-native';


const { width, height } = Dimensions.get('window');

export const colors = {
  // main colors
  theme: '#F7E53B', // other option: yolk
  text: '#333',
  softWhite: '#F5F5F5',
  softBlue: '#3366CC',
  softGrey: '#EEE',
  background: '#F2F2F2',
  lightBackground: '#F8F7F4',
  // supporting colors
  blue: '#3b5998',
  red: '#e74c3c',
  facebook2: '#00838F',
  darkGrey: '#455A64',
  yolk: '#FFE600',
  transparent: 'rgba(0,0,0,0)',
  transparentTextEntry: 'rgba(204,204,204,0.2)',
};

export const globalStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    width,
    height,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    // backgroundColor: colors.background,
  },
});
