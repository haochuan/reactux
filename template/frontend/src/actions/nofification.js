import * as ActionTypes from '../constants/actionTypes';

export function notify(message, type, duration = 3) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SEND_NOTIFICATION,
      class: type,
      duration: duration
    });
  };
}
