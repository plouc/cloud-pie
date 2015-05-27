var React       = require('react');
var Reflux      = require('reflux');
var Chart       = require('./Chart.jsx');
var AwsStore    = require('./../stores/AwsStore');
var AwsActions  = require('./../actions/AwsActions');
var ItemActions = require('./../actions/ItemActions');

module.exports = ChartWrapper = React.createClass({
    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            stack: null
        };
    },

    componentWillMount() {
        this.listenTo(AwsStore, this.onStoreUpdate);
    },

    onStoreUpdate(data) {
        this.setState({
            stack: data
        });
    },

    onItemClick(type, data) {
        AwsActions.activate(type, data);
        ItemActions.set(type, data);
    },

    render() {
        if (this.state.stack === null) {
            return null;
        }

        return <Chart stack={this.state.stack} clickHandler={this.onItemClick}/>;
    }
});