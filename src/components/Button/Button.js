/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';
import { colors } from '../../config/styles';


const StyledButton = (props) => {
  const { text, onPress, buttonStyle, textStyle, ...childProps } = props;
  return (
    <Button
      title={text}
      onPress={onPress}
      buttonStyle={[styles.button, buttonStyle]}
      textStyle={[styles.text, textStyle]}
      color={colors.text}
      containerViewStyle={{backgroundColor: 'transparent'}}
      large
      raised
      {...childProps}
    />
  );
};

StyledButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  buttonStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};

StyledButton.defaultProps = {
  text: 'Button Text',
  onPress: () => console.log('Button pressed'),
};

export default StyledButton;
