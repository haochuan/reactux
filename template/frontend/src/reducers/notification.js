import * as ActionTypes from '../constants/actionTypes';

const initState = {
  show: false,
  message: null,
  class: null,
  duration: 0
};

export default function notification(state = initState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_NOTIFICATION:
      return {
        ...state,
        show: true,
        message: action.message,
        class: action.class,
        duration: action.duration
      };
    case ActionTypes.HIDE_NOTIFICATION:
      return {
        ...state,
        show: false,
        message: action.message,
        class: action.class,
        duration: action.duration
      };
    default:
      return state;
  }
}
