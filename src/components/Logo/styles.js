import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';


export default StyleSheet.create({
  logo: {
    backgroundColor: 'transparent',
    color: colors.theme,
    fontFamily: 'Futura',
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 1 },
  },
});
