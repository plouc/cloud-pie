var React         = require('react');
var Reflux        = require('reflux');
var PanelsStore   = require('./../../stores/PanelsStore');
var PanelsActions = require('./../../actions/PanelsActions');
var ItemInfo      = require('./../ItemInfo.jsx');

module.exports = InfoPanel = React.createClass({
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
        var classes = 'info-panel';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div className={classes}>
                <div className="info-panel__close" onClick={this.onToggleClick}>info</div>
                <ItemInfo/>
            </div>
        );
    }
});