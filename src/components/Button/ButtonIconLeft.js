/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { colors } from '../../config/styles';


const ButtonIconLeft = (props) => {
  const { icon, ...childProps } = props;
  return (
    <Button
      icon={{name: icon, color: colors.text}}
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
