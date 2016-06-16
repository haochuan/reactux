// import style from './style.css';
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { Link } from 'react-router';


import Button from '../../components/Button';

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
            <div>
            <p className="haochuan">
                Clicked: <span>{value}</span> times
                {' '}
                <Button onClickHandler={this._onIncrement} text="+" />
                {' '}
                <Button onClickHandler={this._onDecrement} text="-" />
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
