/* @flow */

import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import metrics from '../../config/metrics';


const Logo = (props) => {
  const { size, style, ...childProps } = props;
  return (
    <Animated.Text
      style={[style, styles.logo, {fontSize: size}]}
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
