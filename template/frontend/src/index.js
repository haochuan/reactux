/**
 *
 * This is the main entry to run react app
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './configureStore';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import Dashboard from './containers/Dashboard';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Home from './containers/Home';
import NotFound from './containers/NotFound';

const store = configureStore();
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="signup" component={Signup} />
          <Route path="login" component={Login} />
          <Route path="notFound" component={NotFound} />
          <Route path="dashboard" component={Dashboard} />
        </Route>
      </Router>
    </Provider>,
    rootEl
  );
}
render();
