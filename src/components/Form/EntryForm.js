import { colors } from '../../config/styles';
import { KeyboardAvoidingContainer, KeyboardEventContainer } from '../Container';
import { Animated, Dimensions, View } from 'react-native';
import metrics from '../../config/metrics';
import Logo from '../Logo';
import React, { PureComponent } from 'react';


const { height } = Dimensions.get('window');


export default class EntryForm extends PureComponent {
  // workaround for Animated.Text shadow
  static shadowHeight = new Animated.Value(1);

  logoSize = new Animated.Value(metrics.logoSizeLarge);

  _keyboardWillShow = (event) => {
    if (height < 600) {
      Animated.timing(this.logoSize, {
        duration: event.duration,
        toValue: metrics.logoSizeSmall,
      }).start();
    }
  }

  _keyboardWillHide = (event) => {
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
        <KeyboardEventContainer keyboardWillShow={this._keyboardWillShow} keyboardWillHide={this._keyboardWillHide} />
        <View style={{ alignItems: 'center', backgroundColor: colors.blue }}>
          <Logo size={this.logoSize} style={{textShadowOffset: { height: EntryForm.shadowHeight }}}/>
          {this.props.children}
        </View>
      </KeyboardAvoidingContainer>
    );
  }
}
