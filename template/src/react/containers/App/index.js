import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  history
} from 'react-router-dom';
import Page1 from '../Page1';
import Page2 from '../Page2';
import { connect } from 'react-redux';
import './style.css';

export class App extends Component {
  constructor(props) {
    super(props);
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
            This is a Home page
            <div>
              <Route path="/page1" component={Page1} />
              <Route path="/page2" component={Page2} />
            </div>
          </div>
          <div className="app-footer" />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(App);
