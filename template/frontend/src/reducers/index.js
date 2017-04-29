/**
 *
 * This is the entry point for all reducers
 *
 */

import { combineReducers } from 'redux';
import authReducer from './auth';

const reducer = combineReducers({
  authReducer
});

export default reducer;
