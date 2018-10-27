import { Button } from '../Button';
import { colors } from '../../config/styles';
import PropTypes from 'prop-types';
import React from 'react';


const ButtonIconLeft = (props) => {
  const { icon, iconColor, ...childProps } = props;
  return (
    <Button
      icon={{name: icon, color: iconColor || colors.text}}
      {...childProps}
    />
  );
};

ButtonIconLeft.propTypes = {
  icon: PropTypes.string,
};

ButtonIconLeft.defaultProps = {
  icon: "navigate-before",
};

export default ButtonIconLeft;
