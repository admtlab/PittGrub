import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

const { width, height } = Dimensions.get('window');


export default StyleSheet.create({
  button: {
    marginTop: 20,
    width: width - 100,
    height: 50,
  },
  buttonText: {
    fontSize: width / 20,
  },
  gate: {
    fontSize: width / 20,
    color: colors.softGrey,
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
  },
  gateView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.softBlue,
    paddingTop: height * 0.25,
  },
});
