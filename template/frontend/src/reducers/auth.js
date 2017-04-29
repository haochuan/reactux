import * as ActionTypes from '../constants/actionTypes';

const initState = {
  isAuthentiated: false
};

export default function auth(state = initState, action) {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthentiated: true
      };
    default:
      return state;
  }
}
