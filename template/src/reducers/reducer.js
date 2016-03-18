import { combineReducers } from 'redux';
import * as ActionTypes from '../constants';

function counter(state = 1, action) {
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

