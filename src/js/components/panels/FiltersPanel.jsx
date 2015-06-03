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

    onOpenClick() {
        PanelsActions.open('filters');
    },

    onCloseClick() {
        PanelsActions.close('filters');
    },

    render() {
        var classes = 'panel panel--left';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div>
                <div className="panel__open panel__open--left" onClick={this.onOpenClick}>
                    <i className="fa fa-filter"/>
                </div>
                <div className={classes}>
                    <h3 className="panel__title">Filters</h3>
                    <div className="panel__close panel__close--left" onClick={this.onCloseClick}>
                        <i className="fa fa-times"/>
                    </div>
                    <Filters/>
                </div>
            </div>
        );
    }
});
