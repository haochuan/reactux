/**
 *
 * This is the entry point one reducer
 *
 */
import { STORE_DATA } from '../../constants/actionTypes';

export default function dribbble(state = {}, action) {
  switch (action.type) {
    case STORE_DATA:
      return action.response;
    default:
      return state;
  }
}
