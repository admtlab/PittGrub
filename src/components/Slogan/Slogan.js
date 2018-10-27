import { Text } from 'react-native';
import PropTypes from 'prop-types'
import React from 'react';
import styles from './styles';
import metrics from '../../config/metrics';


const Slogan = (props) => {
  const {size, style, ...childProps} = props;
  return(
    <Text style={[style, styles.slogan, {fontSize: size}]}
      {...childProps}>
      find your free food
    </Text>
  );
};

Slogan.propTypes = {
  size: PropTypes.number,
};

Slogan.defaultProps = {
  size: metrics.sloganSize,
};

export default Slogan;
