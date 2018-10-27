import { colors } from '../../config/styles';
import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  slogan: {
    backgroundColor: 'transparent',
    color: colors.softWhite,
    fontFamily: 'Futura',
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
  },
});
