import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './store/configureStore';
import Counter from './containers/Counter';
import counter from './reducers/reducer';

// const store = (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(counter);
const store = configureStore(window.__INITIAL_STATE__);
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Counter 
        value={store.getState()} 
        onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
        onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    rootEl  
  );
}

render();
store.subscribe(render);
