/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import styles from './styles';
import { colors } from '../../config/styles';


const Logo = (props) => {
  const { size } = props;
  return (
    <Text style={[styles.logo, {fontSize: size}]}>PittGrub</Text>
  );
};

Logo.propTypes = {
  size: PropTypes.number,
};

Logo.defaultProps = {
  size: 94,
};

export default Logo;
