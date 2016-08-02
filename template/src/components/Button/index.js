import React, { Component, PropTypes } from 'react';

class Button extends Component {
  render() {
    const { text, onClickHandler } = this.props;
    return (
      <button onClick={onClickHandler}>{text}</button>
    );
  }
}

export default Button;
