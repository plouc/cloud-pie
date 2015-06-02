/* @flow */
import Reflux        from 'reflux';
import PanelsActions from './../actions/PanelsActions';

var _panelsState = {
    info:    false,
    filters: true
};

export default Reflux.createStore({
    listenables: PanelsActions,

    open(panelId: string) {
        _panelsState[panelId] = true;

        this.trigger(panelId, _panelsState[panelId]);
    },

    close(panelId: string) {
        _panelsState[panelId] = false;

        this.trigger(panelId, _panelsState[panelId]);
    },

    toggle(panelId: string) {
        _panelsState[panelId] = !_panelsState[panelId];

        this.trigger(panelId, _panelsState[panelId]);
    },

    get(panelId: string): boolean {
        return _panelsState[panelId];
    }
});
