var React = require('react');
var NumberStore = require('../stores/NumberStore');

function getNumber() {
    return {
        value: NumberStore.getNumber()
    };
}

var Display = React.createClass({

    getInitialState: function() {
        return getNumber();
    },

    componentDidMount: function() {
        NumberStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NumberStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getNumber());
    },

    render: function() {
        return (
            <div>
                <input type="text" value={this.state.value}></input>
            </div>
        );
    }

});

module.exports = Display;
