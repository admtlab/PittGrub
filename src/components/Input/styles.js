import { colors } from '../../config/styles';
import { Dimensions, StyleSheet } from 'react-native';


const { width } = Dimensions.get('window');


export default StyleSheet.create({
  input: {
    textAlign: 'center',
    borderRadius: 1,
    color: colors.softGrey,
    backgroundColor: colors.transparentTextEntry,
    fontSize: width / 20,
    width: width - 40,
    height: 30,
    marginBottom: 10,
  }
});
