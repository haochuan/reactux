var React = require('react');
var AppActions = require('../actions/AppActions');


var Button = React.createClass({

    render: function() {
        return (
            <div>
                <button className="add" onClick={this._add}>ADD</button>
                <button className="sub" onClick={this._sub}>SUB</button>
            </div>
        );
    },

    _add: function() {
        AppActions.add();
    },

    _sub: function() {
        AppActions.sub();
    }

});

module.exports = Button;
