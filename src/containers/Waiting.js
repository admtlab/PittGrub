import React from 'react';
import { Button, Text, View } from 'react-native';

export default class WaitingScreen extends React.Component {
  constructor() {
    super();
    this.state = { };
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#333333'}}>
        <Text height={0}
          style={{color: 'white', paddingTop: 40}}>
          {"Your account is pending approval. We will notify you when you have been accepted. Thanks for signing up for PittGrub!"}
        </Text>
        <Button
          title="BACK"
          large
          raised
          fontSize={20}
          color='#333333'
          height={80}
          backgroundColor='rgb(247, 229, 59)'
          onPress={() => this.props.navigation.goBack(null)}
          style={{width: 150, height: 80, alignItems: 'center'}} />
      </View>
    );
  }
}