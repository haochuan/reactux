var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var AppActions = {
    add: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ADD
        });
    },

    sub: function() {
        AppDispatcher.dispatch({
            actionType: Constants.SUB
        });
    }
};

module.exports = AppActions;
