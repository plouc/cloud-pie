var Reflux        = require('reflux');
var ItemActions   = require('./../actions/ItemActions');
var PanelsActions = require('./../actions/PanelsActions');

module.exports = ItemStore = Reflux.createStore({
    listenables: ItemActions,

    set(itemType, itemInfo) {
        PanelsActions.open('info');

        this.trigger(itemType, itemInfo);
    }
});