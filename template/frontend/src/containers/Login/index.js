import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginFrom from '../../components/LoginForm';
import { login } from '../../actions/auth';
import './style.css';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.submitLogin = this.submitLogin.bind(this);
  }
  submitLogin(username, password) {
    this.props.dispatch(login(username, password));
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
