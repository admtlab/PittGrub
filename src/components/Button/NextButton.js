/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonIconRight } from './ButtonIconRight';
import styles from './styles';
import { colors } from '../../config/styles';


const NextButton = (props) => {
  const { text, icon, ...childProps } = props;
  return (
    <ButtonIconRight
      text={text}
      icon={icon}
      {...childProps}
    />
  );
};

NextButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
};

NextButton.defaultProps = {
  text: 'NEXT',
  icon: "navigate-next",
};

export default NextButton;
