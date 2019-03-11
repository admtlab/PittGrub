import React, { PureComponent } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { KeyboardAvoidingContainer, KeyboardEventContainer } from '../Container';
import Logo from '../Logo';
import metrics from '../../config/metrics';
import { colors } from '../../config/styles';


const { height } = Dimensions.get('window');


export default class EntryForm extends PureComponent {
  // workaround for Animated.Text shadow
  static shadowHeight = new Animated.Value(1);

  logoSize = new Animated.Value(metrics.logoSizeLarge);

  keyboardWillShow = (event) => {
    if (height < 600) {
      Animated.timing(this.logoSize, {
        duration: event.duration,
        toValue: metrics.logoSizeSmall,
      }).start();
    }
  }

  keyboardWillHide = (event) => {
    if (height < 600) {
      Animated.timing(this.logoSize, {
        duration: event.duration,
        toValue: metrics.logoSizeLarge,
      }).start();
    }
  }

  render() {
    return (
      <KeyboardAvoidingContainer style={{ backgroundColor: colors.blue }}>
        <KeyboardEventContainer keyboardWillShow={this.keyboardWillShow} keyboardWillHide={this.keyboardWillHide} />
        <View style={{ alignItems: 'center', backgroundColor: colors.blue }}>
          <Logo size={this.logoSize} style={{ textShadowOffset: { height: EntryForm.shadowHeight } }} />
          {this.props.children}
        </View>
      </KeyboardAvoidingContainer>
    );
  }
}
