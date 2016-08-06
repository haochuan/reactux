import React, { Component, PropTypes } from 'react';

const Button = (props) => (
  <button onClick={props.onClickHandler}>{props.text}</button>
);

Button.propTypes = {
  value: PropTypes.number,
  onClickHandler: PropTypes.func,
  text: PropTypes.string
};

export default Button;
