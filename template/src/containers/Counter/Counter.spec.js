import test from 'tape'
import expect from 'expect'
import React from 'react'
import { shallow } from 'enzyme'
import { Counter } from './'

function setupActions() {
  return {
    increment: expect.createSpy(),
    decrement: expect.createSpy()
  }
}

test('The init display count should be 0', (it) => {
  const wrapper = shallow(<Counter value={ 0 }/>);
  it.plan(1);
  it.equal(wrapper.find('span').text(), '0');
  it.end();
});

test('The counter display should be based on the props value', (it) => {
  const wrapper = shallow(<Counter value={ 10 }/>);
  it.plan(1);
  it.equal(wrapper.find('span').text(), '10');
  it.end();
});

// TODO: test the button click event
// Now the click in the component will call this.dispatch, 
// but in the test there is no way to get that,
// Better to just call this.props.somefunction for the onClick
// 
// 
// test('Increase button will call action.increment()', (it) => {
//     const wrapper = shallow(<Counter value={ 10 }/>);
//     const actions = setupActions();
//     const button = wrapper.find('button').at(0).simulate('click');
//     expect(actions.onIncrement).toHaveBeenCalled();
// });