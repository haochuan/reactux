/**
 *
 * This is the entry point for all reducers
 *
 */

import { combineReducers } from 'redux';
import * as ActionTypes from '../constants/actionTypes';

const numberReducer = function(state = 1, action) {
  switch (action.type) {
    case ActionTypes.ACTION_ONE:
      return state + 1;
    case ActionTypes.ACTION_TWO:
      return state - 1;
    default:
      return state;
  }
};

const reducer = combineReducers({
  numberReducer
});

export default reducer;
