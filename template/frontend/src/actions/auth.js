import fetch from 'isomorphic-fetch';
import * as ActionTypes from '../constants/actionTypes';
import { notify } from './nofification';

export function login(username, password) {
  return (dispatch, getState) => {
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(response => {
        console.log(response);
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
    dispatch(notify('Login Successfully', 'success'));
  };
}

function loginFail() {
  return (dispatch, getState) => {
    dispatch(notify('Login Failed', 'error'));
  };
}
