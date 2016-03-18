import * as ActionTypes from '../constants';

export function increment() {
    return {
        type: ActionTypes.INCREMENT
    }
}

export function decrement() {
    return {
        type: ActionTypes.DECREMENT
    }
}