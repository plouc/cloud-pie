/* @flow */
import Reflux             from 'reflux';
import CollapsibleActions from './../actions/CollapsibleActions';

var currentStates = {
    'vpc.id': true
};

function ensureIdExists(id: string) {
    if (!currentStates.hasOwnProperty(id)) {
        currentStates[id] = false;
    }
}

export default Reflux.createStore({
    listenables: CollapsibleActions,

    open(id: string) {
        ensureIdExists(id);

        currentStates[id] = true;

        this.trigger(id, currentStates[id]);
    },

    close(id: string) {
        ensureIdExists(id);

        currentStates[id] = false;

        this.trigger(id, currentStates[id]);
    },

    toggle(id: string) {
        ensureIdExists(id);

        currentStates[id] = !currentStates[id];

        this.trigger(id, currentStates[id]);
    },

    get(id: string): boolean {
        ensureIdExists(id);

        return currentStates[id];
    }
});
