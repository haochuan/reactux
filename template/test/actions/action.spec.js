import test from 'ava';
import sinon from 'sinon';
import { increment, decrement } from 'actions';
import * as ActionTypes from 'constants/actionTypes';

// does the result action have the given payload?
test('action->increment has the givin payoload', t => {
  const fn = increment();
  t.true(fn instanceof Function, "increment is a function");
  const dispatch = sinon.spy();
  const getState = () => ({counter: 0});
  fn(dispatch, getState);
  t.true(dispatch.calledWith({ type: ActionTypes.INCREMENT }), "increment dispatches INCREMENT");
});

// does the result action have the given payload?
test('action->decrement has the givin payoload', t => {
  const fn = decrement();
  t.true(fn instanceof Function, "decrement is a function");
  const dispatch = sinon.spy();
  const getState = () => ({counter: 0});
  fn(dispatch, getState);
  t.true(dispatch.calledWith({ type: ActionTypes.DECREMENT }), "decrement dispatches DECREMENT");
});