import PropTypes from 'prop-types';
import React from 'react';
import { TextInput } from 'react-native';
import styles from './styles';
import { colors } from '../../config/styles';


const PasswordInput = React.forwardRef((props, ref) => {
  const { value, onChangeText, submit, placeholder, ...childProps } = props;

  return (
    <TextInput
      ref={ref}
      placeholder={placeholder}
      value={value}
      secureTextEntry
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="send"
      enablesReturnKeyAutomatically
      onChangeText={onChangeText}
      onSubmitEditing={submit}
      blurOnSubmit
      style={styles.input}
      marginBottom={10}
      inputStyle={{ fontSize: 20 }}
      placeholderTextColor={colors.text}
      {...childProps}
    />
  );
});

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

PasswordInput.defaultProps = {
  placeholder: 'Password',
};

export default PasswordInput;
