import React from 'react';
import { Alert, Linking, Text } from 'react-native';


export const createLink = (url, text = '') => (
  <Text
    style={{ textDecorationLine: 'underline', textDecorationColor: '#333' }}
    onPress={() => Linking.openURL(url).catch(e => handleError(e))}
  >
    {text || url}
  </Text>
);

export const handleError = (err, message) => {
  console.log(err);
  Alert.alert(
    'Error',
    message || 'An error occurred. Please try again later',
    { text: 'OK' },
  );
};
