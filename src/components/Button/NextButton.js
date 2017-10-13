/* @flow */

import React from 'react';
import { Button } from 'react-native-elements';
import styles from './styles';
import { colors } from '../../config/styles';


const NextButton = (props) => {
  const { text, icon, onPress, buttonStyle, textStyle } = props;
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
      iconRight
      icon={{name: icon, color: colors.text}}
    />
  );
};

NextButton.propTypes = {
  text: React.PropTypes.string,
  icon: React.PropTypes.string,
  onPress: React.PropTypes.func,
  buttonStyle: React.PropTypes.any,
  textStyle: React.PropTypes.any,
};

NextButton.defaultProps = {
  text: 'Next',
  icon: 'navigate-next',
  onPress: () => console.log('Button pressed'),
};

export default NextButton;
