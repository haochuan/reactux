/**
 *
 * This is a place to get data from API then do the data pre processing
 * isomorphic-fetch for ajax
 * normalizr for normalizing the data
 *
 */
import { normalize, Schema, arrayOf } from 'normalizr';
import 'isomorphic-fetch';


/*= ============================================
=            Example to call dribbble shot           =
============================================  =*/

// example URL to get latest shot in dribbble
const URL = 'https://api.dribbble.com/v1/shots?access_token=4b425081a3aa6325ec4c3413a6c765c3e26b9bd14f7288883227b5041aad13a8';

// define schema
const shot = new Schema('shots');
const user = new Schema('users');
const team = new Schema('teams');

// define nested rules
shot.define({
  author: user,
  team
});

export function fetchData() {
  return fetch(URL)
    .then(response => {
      const result = response.json();
      return result;
    })
    .then(jsonData => {
      const result = jsonData.map((item) => {
        const normalized = normalize(item, shot);
        return normalized;
      });
      return result;
    })
    .catch(e => {
      console.log('failed', e);
    });
}

export default {
  fetchData
};

/*= ====  End of Example to call dribbble shot   ===== =*/
