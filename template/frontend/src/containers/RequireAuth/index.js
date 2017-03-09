import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import './style.css';

export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!this.props.authenticated) {
        browserHistory.push('/login');
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.push('/login');
      }
    }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }
  return connect(mapStateToProps)(Authentication);
}

const mapStateToProps = state => ({
  authenticated: state.authenticated
});
