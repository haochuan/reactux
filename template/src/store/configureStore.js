import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/reducer';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

export function configureStore(initialState) {
    let store;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        store = compose(
            applyMiddleware(thunk)
        )(createStore)(rootReducer, initialState);
    } else {
        store = compose(
            applyMiddleware(thunk, logger),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )(createStore)(rootReducer, initialState);
    }

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/reducer', () => {
            const nextReducer = require('../reducers/reducer');
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
