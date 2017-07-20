import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import './style.css';

const Doc = props => {
  return <Markdown source={props.data} />;
};

export default Doc;
