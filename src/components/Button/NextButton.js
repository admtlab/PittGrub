/* @flow */

import React from 'react';
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
  text: React.PropTypes.string,
  icon: React.PropTypes.string,
};

NextButton.defaultProps = {
  text: 'NEXT',
  icon: "navigate-next",
};

export default NextButton;
