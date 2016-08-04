import React, { Component, PropTypes } from 'react';

const Button = (props) => (
  <button onClick={this.props.onClickHandler}>{this.props.text}</button>
);

Button.PropTypes = {
  onClickHandler: PropTypes.function,
  text: PropTypes.string
};

export default Button;
