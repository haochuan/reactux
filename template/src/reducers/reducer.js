import { combineReducers } from 'redux';
import * as ActionTypes from '../constants';

export function counter(state = 0, action) {
    switch (action.type) {
        case ActionTypes.INCREMENT:
            return state + 1;
        case ActionTypes.DECREMENT:
            return state - 1;
        default: 
            return state;
    }
}

const reducer = combineReducers({
    counter
});

export default reducer;

