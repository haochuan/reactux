import React from 'react';
import { shallow } from 'enzyme';
import { Counter } from '../../src/containers/Counter';

  // it('should be a function', () => {
  //   expect(3).toBeInstanceOf(Number);
  // });

describe('Component: Counter', () => {
  it('The init display count should be 0', () => {
    const wrapper = shallow(<Counter value={0}/>);
    expect(wrapper.find('span').text()).toMatch(/0/);
  });

  it('The counter display should be based on the props value', () => {
    const wrapper = shallow(<Counter value={ 10 }/>);
    expect(wrapper.find('span').text()).toMatch(/10/);
  });
});