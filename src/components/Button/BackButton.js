/* @flow */

import React from 'react';
import { Button } from 'react-native-elements';
import styles from './styles';
import { colors } from '../../config/styles';


const BackButton = (props) => {
  const { onPress, buttonStyle, textStyle } = props;
  return (
    <Button
      title={"BACK"}
      onPress={onPress}
      buttonStyle={[styles.button, buttonStyle]}
      textStyle={[styles.text, textStyle]}
      color={colors.text}
      containerViewStyle={{backgroundColor: 'transparent'}}
      icon={{name: 'navigate-before', color: colors.text}}
      large
      raised
    />
  );
};

BackButton.propTypes = {
  onPress: React.PropTypes.func,
  buttonStyle: React.PropTypes.any,
  textStyle: React.PropTypes.any,
};

BackButton.defaultProps = {
  onPress: () => console.log('Button pressed'),
};

export default BackButton;
