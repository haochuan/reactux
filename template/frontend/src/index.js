/**
 *
 * This is the main entry to run react app
 *
 */

import React from "react";
import ReactDOM from "react-dom";
import { configureStore } from "./configureStore";
import { Router, Route, hashHistory } from "react-router";
import { Provider } from "react-redux";

import Counter from "./containers/Counter";
import TabOne from "./components/TabOne";
import TabTwo from "./components/TabTwo";

const store = configureStore();
const rootEl = document.getElementById("root");

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route name="home" path="/" component={Counter}>
          <Route path="tabone" component={TabOne} />
          <Route path="tabtwo" component={TabTwo} />
        </Route>
      </Router>
    </Provider>,
    rootEl
  );
}
render();
