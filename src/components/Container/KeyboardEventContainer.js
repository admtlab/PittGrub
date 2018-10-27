import { Keyboard } from 'react-native';
import React, { Component } from 'react';


export default class EntryForm extends Component {

  componentDidMount() {
    // add keyboard listeners on mount
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount() {
    // remove listeners
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardWillShow = (event) => {
    this.props.keyboardWillShow(event);
  }

  _keyboardWillHide = (event) => {
    this.props.keyboardWillHide(event);
  }

  render() {
    return null;
  }
}
