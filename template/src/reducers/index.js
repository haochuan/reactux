import { combineReducers } from 'redux';
import counter from './counter';
import dribbble from './dribbble';


const reducer = combineReducers({
  counter,
  dribbble
});

export default reducer;

