/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import styles from './styles';
import { colors } from '../../config/styles';


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
  size: PropTypes.object,
};

Logo.defaultProps = {
  size: 94,
};

export default Logo;
