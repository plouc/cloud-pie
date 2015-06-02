var React         = require('react');
var Reflux        = require('reflux');
var PanelsStore   = require('./../../stores/PanelsStore');
var PanelsActions = require('./../../actions/PanelsActions');
var Filters       = require('./../filters/Filters.jsx');

module.exports = FiltersPanel = React.createClass({
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

    onCloseClick() {
        PanelsActions.close('filters');
    },

    render() {
        var classes = 'filters-panel';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div className={classes}>
                <div className="filters-panel__close" onClick={this.onCloseClick}>close</div>
                <Filters/>
            </div>
        );
    }
});