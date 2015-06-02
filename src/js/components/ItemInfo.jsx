import React            from 'react';
import Reflux           from 'reflux';
import ItemStore        from './../stores/ItemStore';
import AutoscalingItem  from './items/AutoscalingItem.jsx';
import InstanceItem     from './items/InstanceItem.jsx';
import VpcItem          from './items/VpcItem.jsx';
import SubnetItem       from './items/SubnetItem.jsx';
import VolumeItem       from './items/VolumeItem.jsx';
import IgwItem          from './items/IgwItem.jsx';
import PeeringItem      from './items/PeeringItem.jsx';
import LoadBalancerItem from './items/LoadBalancerItem.jsx';

export default React.createClass({
    displayName: 'ItemInfo',

    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            type:   null,
            data:   null,
            opened: false
        };
    },

    componentWillMount() {
        this.listenTo(ItemStore, this.onStoreUpdate);
    },

    onStoreUpdate(type, data) {
        this.setState({
            type: type,
            data: data
        });
    },

    render() {
        var infoNode = null;

        switch (this.state.type) {
            case 'autoscaling':
                infoNode = <AutoscalingItem data={this.state.data}/>;
                break;

            case 'instance':
                infoNode = <InstanceItem data={this.state.data}/>;
                break;

            case 'vpc':
                infoNode = <VpcItem data={this.state.data}/>;
                break;

            case 'subnet':
                infoNode = <SubnetItem data={this.state.data}/>;
                break;

            case 'volume':
                infoNode = <VolumeItem data={this.state.data}/>;
                break;

            case 'igw':
                infoNode = <IgwItem data={this.state.data}/>;
                break;

            case 'peering':
                infoNode = <PeeringItem data={this.state.data}/>;
                  break;

            case 'lb':
                infoNode = <LoadBalancerItem data={this.state.data}/>;
                  break;

            default:
                break;
        }

        var classes = 'item-info';
        if (this.state.opened === true) {
            classes += ' _is-opened';
        }

        return (
            <div className={classes}>
                {infoNode}
            </div>
        );
    }
});
