import PropTypes from 'prop-types';
import React from 'react';
import { Animated } from 'react-native';
import styles from './styles';
import metrics from '../../config/metrics';


const Logo = (props) => {
  const { size, style, ...childProps } = props;
  return (
    <Animated.Text
      style={[styles.logo, style, { fontSize: size }]}
      {...childProps}
    >
      PittGrub
    </Animated.Text>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

Logo.defaultProps = {
  size: metrics.logoSizeLarge,
};

export default Logo;
