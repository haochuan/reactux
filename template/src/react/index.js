/**
 *
 * This is the main entry to run react app
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './configureStore';
import { Provider } from 'react-redux';

import App from './containers/App';

const store = configureStore();
const rootEl = document.getElementById('root');
const Root = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

function render() {
  ReactDOM.render(<Root />, rootEl);
}
render();
