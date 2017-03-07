import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './style.css';

export class NotFound extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { value } = this.props;
    return (
      <div>
        This is the NotFound page route.
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(NotFound);
