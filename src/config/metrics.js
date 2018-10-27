import { Dimensions, Platform } from 'react-native'


const { width, height } = Dimensions.get('window')

const iPhoneType = (() => {
  if (Platform.OS === 'ios') {
    if (height >= 812 || width >= 812) {
      return 'X';
    } else if (height === 736 || width === 736) {
      return '+';
    } else if (height === 667 || width === 667) {
      return '-';
    } else if (height === 568 || width === 568) {
      return 'SE';
    }
  }
  return null;
})();

console.log('width: ' + width);
console.log('height: ' + height);

const metrics = {
  iPhoneType: iPhoneType,
  logoSizeLarge: iPhoneType === 'SE' ? 80 : 94,
  logoSizeSmall: iPhoneType === 'SE' ? 52 : 62,
  sloganSize: iPhoneType === 'SE' ? 36 : 42,
  fontSize: iPhoneType === 'SE' ? 16 : 20,
  fontSizeSmall : iPhoneType === 'SE' ? 14 : 18,
  smallMargin: 5,
  tabBarHeight: iPhoneType === 'X' ? 65 : 45,
  tabBarPadding: iPhoneType === 'X' ? 15 : 0,
  tabBarIconHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  // navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  // marginHorizontal: 10,
  // marginVertical: 10,
  // section: 25,
  // baseMargin: 10,
  // doubleBaseMargin: 20,
  // doubleSection: 50,
  // horizontalLineHeight: 1,
  // searchBarHeight: 30,
  // buttonRadius: 4,
  // icons: {
  //   tiny: 15,
  //   small: 20,
  //   medium: 30,
  //   large: 45,
  //   xl: 50
  // },
  // images: {
  //   small: 20,
  //   medium: 40,
  //   large: 60,
  //   logo: 200
  // }
};

export default metrics;
