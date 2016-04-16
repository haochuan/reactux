import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import counter from './reducers/reducer';
import routes from './routes';

// const store = (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(counter);
const store = configureStore(window.__INITIAL_STATE__);
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
        <Router routes={routes} />
    </Provider>,
    rootEl  
  );
}

render();
