import reducer from '../../src/reducers/counter';
import * as actionTypes from '../../src/constants/ActionTypes';
import { increment, decrement } from '../../src/actions';

describe('counter reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(0)
  });

  it('should handle the increment/decrement action', () => {
    expect(
      reducer(0, {
        type: actionTypes.INCREMENT
      })
    ).toEqual(1)

    expect(
      reducer(1, {
        type: actionTypes.DECREMENT
      })
    ).toEqual(0)
  });
  it('State will not change for unknown actions', () => {
    expect(
      reducer(0, {
        type: 'UNKNOWN'
      })
    ).toEqual(0)
  });
});

