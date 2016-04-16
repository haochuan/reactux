import * as ActionTypes from '../constants';

export function increment() {
    // with redux thunk, in actions you have the access to store.dispatch and store.getState
    return ((dispatch, getState) => {
        return {
            type: ActionTypes.INCREMENT
        };
    });
}

export function decrement() {
    // with redux thunk, in actions you have the access to store.dispatch and store.getState
    return ((dispatch, getState) => {
        return {
            type: ActionTypes.DECREMENT
        };
    });
}