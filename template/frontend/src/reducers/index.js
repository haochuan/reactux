/**
 *
 * This is the entry point for all reducers
 *
 */

import { combineReducers } from 'redux';
import auth from './auth';
import notification from './notification';

const reducer = combineReducers({
  auth,
  notification
});

export default reducer;
