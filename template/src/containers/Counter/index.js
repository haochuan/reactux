// import style from './style.css';
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../actions';

export class Counter extends Component {
  constructor(props) {
    super(props)
    this._onIncrement = this._onIncrement.bind(this)
    this._onDecrement = this._onDecrement.bind(this)
    this.incrementAsync = this.incrementAsync.bind(this)
    this.incrementIfOdd = this.incrementIfOdd.bind(this)
  }

  incrementIfOdd() {
    if (this.props.value % 2 === 1) {
      this.props.onIncrement()
    }
  }

  incrementAsync() {
    setTimeout(this.props.onIncrement, 1000)
  }

  _onIncrement() {
    this.props.dispatch(actions.increment());
  }

  _onDecrement() {
    this.props.dispatch(actions.decrement());
  }

  render() {
    const { value } = this.props
    return (
      <p className="haochuan">
        Clicked: <span>{value}</span> times
        {' '}
        <button onClick={this._onIncrement}>
          +
        </button>
        {' '}
        <button onClick={this._onDecrement}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
    value: state.counter
});

export default connect(mapStateToProps)(Counter);
