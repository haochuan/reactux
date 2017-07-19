import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Button } from 'antd';
import './style.css';

export class Home extends Component {
  constructor(props) {
    super(props);
  }

  goLogin() {
    browserHistory.push('/login');
  }

  goSignup() {
    browserHistory.push('/signup');
  }

  goDashboard() {
    browserHistory.push('/dashboard');
  }

  goNotFound() {
    browserHistory.push('/notFound');
  }

  render() {
    const { value } = this.props;
    return (
      <div>
        This is the home page route.
        <div>
          <Button type="primary" onClick={this.goLogin}>Login</Button>
          <Button type="primary" onClick={this.goSignup}>Signup</Button>
          <Button type="primary" onClick={this.goDashboard}>Dashboard</Button>
          <Button type="primary" onClick={this.goNotFound}>
            Non Existed Page
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Home);
