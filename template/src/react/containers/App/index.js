import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Notification from '../../components/Notification';
import './style.css';

export class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { value } = this.props;
    return (
      <div className="app">
        <Notification notification={this.props.notification} />
        <div className="app-header" />
        <div className="app-container">
          {this.props.children}
        </div>
        <div className="app-footer" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notification: state.notification
});

export default connect(mapStateToProps)(App);
