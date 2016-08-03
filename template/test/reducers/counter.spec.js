import test from 'ava';
import reducer from 'reducers/counter';
import { increment, decrement } from 'actions';

test('Init state should be 0', t => {
  t.deepEqual(reducer(undefined, {}), 0, 'The init state should be 0');
});

test('Should handle the increment action', t => {
  t.deepEqual(reducer(0, {type: 'INCREMENT'}), 1, 'Should handle the increment action');
});

test('Should handle the decrement action', t => {
  t.deepEqual(reducer(0, {type: 'INCREMENT'}), 1, 'Should handle the decrement action');
});

test('State will not change for other actions', t => {
  t.deepEqual(reducer(0, {type: 'INCREMENT'}), 1, 'State will not change for other actions');
});

