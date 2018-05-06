/* @flow */

import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';


const Logo = (props) => {
  const { size, ...childProps } = props;
  return (
    <Animated.Text
      style={[styles.logo, {fontSize: size}]}
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
  size: 94,
};

export default Logo;
