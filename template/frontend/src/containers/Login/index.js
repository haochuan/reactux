import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginFrom from '../../components/LoginForm';
import './style.css';

export class Login extends Component {
  constructor(props) {
    super(props);
  }
  submitLogin(username, password) {
    console.log(username, password);
  }

  render() {
    const { value } = this.props;
    return (
      <div>
        <LoginFrom submitLoginHandler={this.submitLogin} />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Login);
