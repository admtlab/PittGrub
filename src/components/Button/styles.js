import { colors } from '../../config/styles';
import { Dimensions, StyleSheet } from 'react-native';


const { width } = Dimensions.get('window');


export default StyleSheet.create({
  button: {
    backgroundColor: colors.theme,
    borderRadius: 25,
    marginTop: 20,
    width: width - 100,
    height: 50,
  },
  text: {
    fontSize: width / 21,
  }
});
