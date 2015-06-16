var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Constants = require('../constants/Constants');

var CHANGE_EVENT = 'change';

var _number = 0;

/**
 * add 1
 */
function add() {
    _number++;
}

function sub() {
    _number--;
}

var NumberStore = assign({}, EventEmitter.prototype, {
    getNumber: function() {
        return _number;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    dispatcherIndex: AppDispatcher.register(function(action) {

        switch (action.actionType) {
            case Constants.ADD:
                add();
                NumberStore.emitChange();
                break;
            case Constants.SUB:
                sub();
                NumberStore.emitChange();
                break;
        }
        return true;
    })
});

module.exports = NumberStore;
