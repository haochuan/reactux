import test from 'tape'
import counter from '../../reducers/counter'


test('counter reducer', (it) => {
    it.plan(4);
    it.equal(counter(undefined, {}), 0, 'The init state should be 0');
    it.equal(counter(0, {type: 'INCREMENT'}), 1, 'Should handle the increment action');
    it.equal(counter(1, {type: 'DECREMENT'}), 0, 'Should handle the decrement action');
    it.equal(counter(1, {type: 'OTHER'}), 1, 'State will not change for other actions');
});

