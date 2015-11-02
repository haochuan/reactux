import React, { Component, PropTypes } from 'react';

class Main extends Component {
    const CONTEXT = window.AudioContext || window.webkitAudioContext; // web audio context
    const OUTPUT = CONTEXT.destidation; // output

    render: function() {
        return (
            <div>
                <Display />
                <Button />
            </div>
        );
    }
}

module.exports = Main;
