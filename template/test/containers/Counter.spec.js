import test from 'ava';
import sinon from 'sinon'
import React from 'react'
import { shallow } from 'enzyme'
import { Counter } from 'containers/Counter'

function setupActions() {
  return {
    increment: sinon.spy(),
    decrement: sinon.spy()
  }
}

test('The init display count should be 0', t => {
  const wrapper = shallow(<Counter value={ 0 }/>);
  t.regex(wrapper.find('span').text(), /0/);
});

test('The counter display should be based on the props value', t => {
  const wrapper = shallow(<Counter value={ 10 }/>);
  t.regex(wrapper.find('span').text(), /10/);
});

// TODO: test the button click event
// Now the click in the component will call this.dispatch, 
// but in the test there is no way to get that,
// Better to just call this.props.somefunction for the onClick
// 
// 
// test('Buttons for increace and decreace', t => {
//   // t.plan(4);
//   const wrapper = shallow(<Counter value={ 10 }/>);
//   t.regex(wrapper.find('span').text(), /10/);
//   const increment = setupActions().increment;
//   const button = wrapper.find('button').at(0).simulate('click');
//   // t.true(increment.calledOnce);
//   t.regex(wrapper.find('span').text(), /11/);
// });