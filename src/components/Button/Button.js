import { colors } from '../../config/styles';
import { Text, ViewPropTypes } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles';


const StyledButton = (props) => {
  const { text, onPress, buttonStyle, textStyle, ...childProps } = props;

  return (
    <Button
      title={text}
      onPress={onPress}
      buttonStyle={[styles.button, buttonStyle]}
      textStyle={[styles.text, textStyle]}
      color={colors.text}
      containerViewStyle={{ backgroundColor: 'transparent' }}
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
