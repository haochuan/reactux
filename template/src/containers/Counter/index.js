import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../../actions';
import Button from '../../components/Button';
import './style.css';

export class Counter extends Component {
  constructor(props) {
    super(props);
    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
    this.incrementAsync = this.incrementAsync.bind(this);
    this.incrementIfOdd = this.incrementIfOdd.bind(this);
  }


  onIncrement() {
    this.props.dispatch(actions.increment());
  }

  onDecrement() {
    this.props.dispatch(actions.decrement());
  }
  incrementIfOdd() {
    if (this.props.value % 2 === 1) {
      this.props.dispatch(actions.increment());
    }
  }

  incrementAsync() {
    setTimeout(this.props.dispatch(actions.increment()), 1000);
  }

  render() {
    const { value } = this.props;
    return (
      <div>
        <p className="haochuan">
          Clicked: <span>{value}</span> times
          {' '}
          <Button onClickHandler={this.onIncrement} text="+" />
          {' '}
          <Button onClickHandler={this.onDecrement} text="-" />
          {' '}
          <button onClick={this.incrementIfOdd}>
            Increment if odd
          </button>
          {' '}
          <button onClick={this.incrementAsync}>
            Increment async
          </button>
          <Link to="/tabone">tab 1</Link>
          <Link to="/tabtwo">tab 2</Link>
        </p>
        this is for tab: {this.props.children}
      </div>
    );
  }
}

Counter.propTypes = {
  value: PropTypes.number,
  dispatch: PropTypes.func,
  children: PropTypes.string
};

const mapStateToProps = (state) => ({
  value: state.counter
});

export default connect(mapStateToProps)(Counter);
