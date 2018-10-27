import { Animated } from 'react-native';
import metrics from '../../config/metrics';
import PropTypes from 'prop-types';
import styles from './styles';
import React from 'react';


const Logo = (props) => {
  const { size, style, ...childProps } = props;
  return (
    <Animated.Text
      style={[styles.logo, style, {fontSize: size}]}
      {...childProps}>
      PittGrub
    </Animated.Text>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]),
};

Logo.defaultProps = {
  size: metrics.logoSizeLarge,
};

export default Logo;
