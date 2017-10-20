/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
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
  text: PropTypes.string,
  icon: PropTypes.string,
};

BackButton.defaultProps = {
  text: "BACK",
  icon: "navigate-before",
};

export default BackButton;
