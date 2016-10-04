import { increment, decrement } from '../../src/actions';
import * as ActionTypes from '../../src/constants/actionTypes';

// does the result action have the given payload?
describe('actions: increment', () => {
  const fn = increment();
  it('should be a function', () => {
    expect(fn).toBeInstanceOf(Function);
  });
  it('has the givin payoload', () => {
    const dispatch = jest.fn();
    const getState = () => ({counter: 0});
    fn(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: ActionTypes.INCREMENT });
  });
});

describe('actions: decrement', () => {
  const fn = decrement();
  it('should be a function', () => {
    expect(fn).toBeInstanceOf(Function);
  });
  it('has the givin payoload', () => {
    const dispatch = jest.fn();
    const getState = () => ({counter: 0});
    fn(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: ActionTypes.DECREMENT });
  });
});