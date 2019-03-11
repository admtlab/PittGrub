import PropTypes from 'prop-types';
import React from 'react';
import { ButtonIconLeft } from '../Button';
import { colors } from '../../config/styles';

const BackButton = (props) => {
  const { text, icon, ...childProps } = props;
  return (
    <ButtonIconLeft
      title={text}
      icon={icon}
      buttonStyle={{ backgroundColor: colors.softGrey }}
      {...childProps}
    />
  );
};

BackButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
};

BackButton.defaultProps = {
  text: 'BACK',
  icon: 'navigate-before',
};

export default BackButton;
