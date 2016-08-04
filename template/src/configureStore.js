import { compose, createStore, applyMiddleware } from 'redux';
// import { loadState, saveState } from './localStorage'; // use localStorage to store state
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import throttle from 'lodash/throttle';
import rootReducer from './reducers';

const logger = createLogger();
// use localStorage to store state
// const persistedState = loadState();
const persistedState = undefined;

export function configureStore() {
  let store;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    store = compose(
      applyMiddleware(thunk)
    )(createStore)(rootReducer, persistedState);
  } else {
    store = compose(
      applyMiddleware(thunk, logger),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore)(rootReducer, persistedState);
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }

  // use localStorage to store state
  // every time the store changes, update the localstorage
  // throttle: only fire once during every 500 ms
  // store.subscribe(throttle(() => {
  //   saveState({
  //     counter: store.getState().counter
  //   });
  // }, 500));

  return store;
}
