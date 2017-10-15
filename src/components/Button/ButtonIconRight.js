/* @flow */

import React from 'react';
import { Button } from '../Button';
import { colors } from '../../config/styles';


const ButtonIconRight = (props) => {
  const { icon, ...childProps } = props;
  return (
    <Button
      iconRight
      icon={{name: icon, color: colors.text}}
      {...childProps}
    />
  );
};

ButtonIconRight.propTypes = {
  icon: React.PropTypes.string,
};

ButtonIconRight.defaultProps = {
  icon: "navigate-next",
};

export default ButtonIconRight;