var React = require('react');
var Display = require('./DisplayComponent.jsx');
var Button = require('./ButtonComponent.jsx');

var Main = React.createClass({

    render: function() {
        return (
            <div>
                <Display />
                <Button />
            </div>
        );
    }

});

module.exports = Main;
