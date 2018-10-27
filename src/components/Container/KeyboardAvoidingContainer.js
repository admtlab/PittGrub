import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from './styles';


const KeyboardAvoidingContainer = (props) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, props.style]}>
        {props.children}
        <KeyboardSpacer />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default KeyboardAvoidingContainer;
