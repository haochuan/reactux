import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './style.css';

export class Page2 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        This is Page 2
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Page2);
