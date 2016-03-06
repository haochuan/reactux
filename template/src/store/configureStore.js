import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/reducer';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

export function configureStore(initialState) {
    let middlewares = [
        applyMiddleware(thunk, logger)
      ];
    // const store = (window.devToolsExtension ? window.devToolsExtension()(createStore(rootReducer, initialState, applyMiddleware(thunk, logger))) : createStore)(rootReducer, initialState, applyMiddleware(thunk, logger));
    const store = compose(
        applyMiddleware(thunk, logger),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore)(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/reducer', () => {
            const nextReducer = require('../reducers/reducer');
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
