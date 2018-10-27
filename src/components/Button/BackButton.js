import { ButtonIconLeft } from '../Button';
import PropTypes from 'prop-types';
import React from 'react';

const BackButton = (props) => {
  const { text, icon, ...childProps } = props;
  return (
    <ButtonIconLeft
      title={text}
      icon={icon}
      {...childProps} />
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
