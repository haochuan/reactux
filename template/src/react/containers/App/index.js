import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Link,
  history
} from 'react-router-dom';
import axios from 'axios';
import Page1 from '../Page1';
import Page2 from '../Page2';
import Doc from '../../components/Doc';
import { connect } from 'react-redux';
import './style.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: ''
    };
  }
  componentDidMount() {
    // see the endpoint specs in /src/server/router/page.js
    axios({
      method: 'get',
      url: '/page/getReadme'
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({ markdown: response.data });
        }
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response);
        }
      });
  }
  render() {
    return (
      <Router>
        <div className="app">
          <div className="app-header">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/page1">Page 1</Link></li>
              <li><Link to="/page2">Page 2</Link></li>
            </ul>
          </div>
          <div className="app-container">
            <div>
              <Route path="/page1" component={Page1} />
              <Route path="/page2" component={Page2} />
            </div>
            <Doc data={this.state.markdown} />
          </div>
          <div className="app-footer" />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(App);
