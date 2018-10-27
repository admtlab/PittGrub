import { TextInput } from 'react-native';
import { colors } from '../../config/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles';


const EmailInput = (props) => {
  const { value, onChangeText, submit, placeholder, ...childProps } = props;

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      autoCapitalize='none'
      autoCorrect={false}
      keyboardType='email-address'
      returnKeyType='next'
      enablesReturnKeyAutomatically
      onChangeText={onChangeText}
      onSubmitEditing={submit}
      blurOnSubmit={false}
      clearButtonMode='while-editing'
      style={styles.input}
      marginBottom={10}
      inputStyle={{ fontSize: 20 }}
      placeholderTextColor={colors.text}
      {...childProps}
    />
  );
}

EmailInput.propTypes = {
  value: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

EmailInput.defaultProps = {
  placeholder: 'Email Address'
};

export default EmailInput;
