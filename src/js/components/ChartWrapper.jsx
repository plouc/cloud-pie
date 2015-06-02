import React       from 'react';
import Reflux      from 'reflux';
import Chart       from './Chart.jsx';
import AwsStore    from './../stores/AwsStore';
import AwsActions  from './../actions/AwsActions';
import ItemActions from './../actions/ItemActions';

export default React.createClass({
    displayName: 'ChartWrapper',

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
