import { Button } from '../Button';
import { colors } from '../../config/styles';
import PropTypes from 'prop-types';
import React from 'react';


const ButtonIconRight = (props) => {
  const { icon, ...childProps } = props;
  return (
    <Button
      iconRight={{name: icon, color: colors.text}}
      {...childProps}
    />
  );
};

ButtonIconRight.propTypes = {
  icon: PropTypes.string,
};

ButtonIconRight.defaultProps = {
  icon: "navigate-next",
};

export default ButtonIconRight;
