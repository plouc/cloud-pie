import React         from 'react';
import Reflux        from 'reflux';
import PanelsStore   from './../../stores/PanelsStore';
import PanelsActions from './../../actions/PanelsActions';
import Filters       from './../filters/Filters.jsx';

export default React.createClass({
    displayName: 'FiltersPanel',

    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            opened: PanelsStore.get('filters')
        };
    },

    componentWillMount() {
        this.listenTo(PanelsStore, this.onPanelsStoreUpdate);
    },

    onPanelsStoreUpdate(type, opened) {
        if (type !== 'filters') {
            return;
        }

        this.setState({ opened: opened });
    },

    onToggleClick() {
        PanelsActions.toggle('filters');
    },

    render() {
        var classes = 'filters-panel';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div className={classes}>
                <div className="filters-panel__close" onClick={this.onToggleClick}>filters</div>
                <Filters/>
            </div>
        );
    }
});
