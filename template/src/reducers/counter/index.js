/**
 *
 * This is the entry point one reducer
 *
 */
import * as ActionTypes from '../../constants/actionTypes';

export default function counter(state = 0, action) {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return state + 1;
    case ActionTypes.DECREMENT:
      return state - 1;
    default:
      return state;
  }
}
