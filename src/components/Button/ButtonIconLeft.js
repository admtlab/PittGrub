/* @flow */

import React from 'react';
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
  icon: React.PropTypes.string,
};

ButtonIconLeft.defaultProps = {
  icon: "navigate-before",
};

export default ButtonIconLeft;
