import PropTypes from 'prop-types';
import React from 'react';
import { TextInput } from 'react-native';
import { colors } from '../../config/styles';
import styles from './styles';


const EntryInput = React.forwardRef((props, ref) => {
  const { value, onChangeText, submit, placeholder, ...childProps } = props;

  return (
    <TextInput
      ref={ref}
      placeholder={placeholder}
      value={value}
      autoCorrect={false}
      enablesReturnKeyAutomatically
      onChangeText={onChangeText}
      onSubmitEditing={submit}
      blurOnSubmit={false}
      style={styles.input}
      marginBottom={10}
      inputStyle={{ fontSize: 20 }}
      placeholderTextColor={colors.text}
      {...childProps}
    />
  );
});

EntryInput.propTypes = {
  value: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

EntryInput.defaultProps = {
  placeholder: 'Input',
};

export default EntryInput;
