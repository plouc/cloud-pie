var Reflux        = require('reflux');
var PanelsActions = require('./../actions/PanelsActions');

var _panelsState = {
    info:    false,
    filters: false
};

module.exports = ItemStore = Reflux.createStore({
    listenables: PanelsActions,

    open(panelId) {
        _panelsState[panelId] = true;

        this.trigger(panelId, _panelsState[panelId]);
    },

    close(panelId) {
        _panelsState[panelId] = false;

        this.trigger(panelId, _panelsState[panelId]);
    },

    toggle(panelId) {
        _panelsState[panelId] = !_panelsState[panelId];

        this.trigger(panelId, _panelsState[panelId]);
    },

    get(panelId) {
        return _panelsState[panelId];
    }
});