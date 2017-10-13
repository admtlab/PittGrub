/* @flow */

import React from 'react';
import { ButtonIconLeft } from '../Button';
import styles from './styles';
import { colors } from '../../config/styles';


const BackButton = (props) => {
  const { text, icon, ...childProps } = props;
  return (
    <ButtonIconLeft
      text={text}
      icon={icon}
      {...childProps}
    />
  );
};

BackButton.propTypes = {
  text: React.PropTypes.string,
  icon: React.PropTypes.string,
};

BackButton.defaultProps = {
  text: "BACK",
  icon: "navigate-before",
};

export default BackButton;
