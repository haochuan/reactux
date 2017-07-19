/**
 *
 * Action creators
 *
 * Examples:
 *
 */

import axios from 'axios';

export function getTestData() {
  return (dispatch, getState) => {
    return axios({
      method: 'get',
      url: 'https://api.github.com/',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };
}
