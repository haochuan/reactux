import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './style.css';

export class Page1 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        This is Page 1
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Page1);
