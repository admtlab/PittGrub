import { BackButton } from '../Button';
import { PropTypes } from 'prop-types';
import { Animated, Text, View } from 'react-native';
import metrics from '../../config/metrics';
import Logo from '../Logo';
import React from 'react';
import styles from './styles';


const Gate = ({ back }) => {
  const logoSize = new Animated.Value(metrics.logoSizeLarge);

  return (
    <View style={styles.gateView}>
      <Logo size={logoSize} />
      <Text style={styles.gate}>
        Thanks for signing up PittGrub! We will notify you when your account has been approved.
      </Text>
      <BackButton
        onPress={back} 
        style={styles.button}
        textStyle={styles.buttonText} />
    </View>
  );
}

Gate.propTypes = {
  back: PropTypes.func
};

export default Gate;
