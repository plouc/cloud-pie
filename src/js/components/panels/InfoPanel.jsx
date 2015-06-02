import React         from 'react';
import Reflux        from 'reflux';
import PanelsStore   from './../../stores/PanelsStore';
import PanelsActions from './../../actions/PanelsActions';
import ItemInfo      from './../ItemInfo.jsx';

export default React.createClass({
    displayName: 'InfoPanel',

    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            opened: PanelsStore.get('info')
        };
    },

    componentWillMount() {
        this.listenTo(PanelsStore, this.onPanelsStoreUpdate);
    },

    onPanelsStoreUpdate(type, opened) {
        if (type !== 'info') {
            return;
        }

        this.setState({ opened: opened });
    },

    onToggleClick() {
        PanelsActions.toggle('info');
    },

    render() {
        var classes = 'panel panel--right';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div className={classes}>
                <div className="panel__close" onClick={this.onToggleClick}>info</div>
                <ItemInfo/>
            </div>
        );
    }
});
