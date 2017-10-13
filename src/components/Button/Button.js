/* @flow */

import React from 'react';
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
  text: React.PropTypes.string,
  onPress: React.PropTypes.func,
  buttonStyle: React.PropTypes.any,
  textStyle: React.PropTypes.any,
};

StyledButton.defaultProps = {
  text: 'Button Text',
  onPress: () => console.log('Button pressed'),
};

export default StyledButton;
