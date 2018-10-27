import { Dimensions, Platform } from 'react-native'


const { width, height } = Dimensions.get('window')
console.log(`width: ${width}, height: ${height}`);

const iPhoneType = (() => {
  if (Platform.OS === 'ios') {
    if (height === 896 || width === 896) {
      return 'MAX'; // max model
    }
    if (height === 812 || width === 812) {
      return 'X';   // X model
    } else if (height === 736 || width === 736) {
      return '+';   // plus model
    } else if (height === 667 || width === 667) {
      return '-';   // normal model
    } else if (height === 568 || width === 568) {
      return 'SE';  // SE model
    }
  }
  return null;
})();


const metrics = {
  iPhoneType,
  logoSizeLarge: iPhoneType === 'SE' ? 80 : 94,
  logoSizeSmall: iPhoneType === 'SE' ? 52 : 62,
  sloganSize: iPhoneType === 'SE' ? 36 : 42,
  fontSize: iPhoneType === 'SE' ? 16 : 20,
  fontSizeSmall : iPhoneType === 'SE' ? 14 : 18,
  tabBarHeight: (iPhoneType === 'X' || iPhoneType === 'MAX') ? 65 : 50,
  tabBarPadding: (iPhoneType === 'X' || iPhoneType === 'MAX') ? 15 : 0,
  tabBarIconHeight: 30,
  smallMargin: 5,
  // screenWidth: width < height ? width : height,
  // screenHeight: width < height ? height : width,
};

export default metrics;
