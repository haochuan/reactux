/**
 *
 * This is the main entry to run react app
 *
 */


import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './configureStore';
import Root from './containers/Root';

const store = configureStore();
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Root store={store} />,
    rootEl
  );
}
render();
