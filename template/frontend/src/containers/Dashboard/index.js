import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './style.css';

export class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { value } = this.props;
    return (
      <div>
        This is the Dashboard page route.
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Dashboard);
