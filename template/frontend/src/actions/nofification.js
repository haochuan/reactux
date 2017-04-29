import * as ActionTypes from '../constants/actionTypes';

export function notify(message, messageClass, duration = 3) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SHOW_NOTIFICATION,
      class: messageClass,
      message: message,
      duration: duration
    });
    setTimeout(() => {
      dispatch({
        type: ActionTypes.HIDE_NOTIFICATION,
        message: message,
        class: messageClass,
        duration: duration
      });
    }, duration * 1000);
  };
}
