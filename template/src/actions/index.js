/**
 *
 * Action creators
 *
 */

import * as ActionTypes from '../constants/actionTypes';
import { fetchData } from '../apis/';

export function increment() {
  // with redux thunk, in actions you have the access to store.dispatch and store.getState
  return ((dispatch, getState) => {
    dispatch({
      type: ActionTypes.INCREMENT
    });
  });
}

export function decrement() {
  // with redux thunk, in actions you have the access to store.dispatch and store.getState
  return ((dispatch, getState) => {
    dispatch({
      type: ActionTypes.DECREMENT
    });
  });
}


/*= ============================================
=            Example to Ajax calls            =
============================================  =*/

export function storeData() {
  // with redux thunk, in actions you have the access to store.dispatch and store.getState
  return ((dispatch, getState) => {
    fetchData()
      .then(response => {
        dispatch({
          type: ActionTypes.STORE_DATA,
          response
        });
      });
  });
}

/*= ====  End of Example to Ajax calls  ===== =*/
