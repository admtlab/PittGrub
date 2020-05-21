import { Button } from '../Button';
import { colors } from '../../config/styles';
import React from 'react';


const PrimaryButton = (props) => {
  return (
    <Button
      buttonStyle={{backgroundColor: colors.theme}}
      {...props}
    />
  );
};


export default PrimaryButton;
