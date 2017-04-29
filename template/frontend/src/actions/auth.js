import fetch from 'isomorphic-fetch';
import * as ActionTypes from '../constants/actionTypes';

export function login(username, password) {
  fetch('/auth/login', {
    method: 'POST',
    body: { username: username, password: password }
  })
    .then(response => {
      if (response.ok) {
        // login successfult
      } else {
        console.log('login failed');
      }
    })
    .catch(err => {
      console.log(err);
    });
}
