import fetch from 'isomorphic-fetch';
import * as ActionTypes from '../constants/actionTypes';
import { notify } from './nofification';

export function login(username, password) {
  return (dispatch, getState) => {
    fetch('/auth/login', {
      method: 'POST',
      body: { username: username, password: password }
    })
      .then(response => {
        if (response.ok) {
          // login successfult
          dispatch(loginSuccess());
        } else {
          dispatch(loginFail());
          console.log('login failed');
        }
      })
      .catch(err => {
        dispatch(loginFail());
        console.log(err);
      });
  };
}

function loginSuccess() {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.LOGIN_SUCCESS
    });
    dispatch(notify('Login Successfully', 'info'));
  };
}

function loginFail() {
  return (dispatch, getState) => {
    dispatch(notify('Login Failed', 'error'));
  };
}
