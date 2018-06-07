import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')

const isiPhoneX = (Platform.OS === 'ios' && (height === 812 || width === 812));

const metrics = {
  isiPhoneX: isiPhoneX,
  logoSizeLarge: width / 4,
  logoSizeSmall: width / 6,
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  tabBarHeight: isiPhoneX ? 65 : 45,
  tabBarPadding: isiPhoneX ? 15 : 0,
  tabBarIconHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
};

export default metrics;
