import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import Counter from './containers/Counter';
import counter from './reducers/reducer';

// const store = (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(counter);
const store = configureStore(window.__INITIAL_STATE__);
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
        <Counter 
            value={store.getState()} 
            onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
            onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
        />
    </Provider>,
    rootEl  
  );
}

render();
