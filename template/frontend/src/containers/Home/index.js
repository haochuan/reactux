import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import './style.css';

export class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { value } = this.props;
    return (
      <div>
        This is the home page route.
        <div>
          <Button type="primary">Login</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Home);
