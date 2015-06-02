/* @flow */
import Reflux        from 'reflux';
import ItemActions   from './../actions/ItemActions';
import PanelsActions from './../actions/PanelsActions';

export default Reflux.createStore({
    listenables: ItemActions,

    set(itemType: string, itemInfo: Object) {
        PanelsActions.open('info');

        this.trigger(itemType, itemInfo);
    }
});
