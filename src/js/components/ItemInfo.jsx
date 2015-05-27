var React            = require('react');
var Reflux           = require('reflux');
var ItemStore        = require('./../stores/ItemStore');
var AutoscalingItem  = require('./items/AutoscalingItem.jsx');
var InstanceItem     = require('./items/InstanceItem.jsx');
var VpcItem          = require('./items/VpcItem.jsx');
var SubnetItem       = require('./items/SubnetItem.jsx');
var VolumeItem       = require('./items/VolumeItem.jsx');
var IgwItem          = require('./items/IgwItem.jsx');
var PeeringItem      = require('./items/PeeringItem.jsx');
var LoadBalancerItem = require('./items/LoadBalancerItem.jsx');

module.exports = ItemInfo = React.createClass({
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
                infoNode = <AutoscalingItem data={this.state.data}/>
                break;

            case 'instance':
                infoNode = <InstanceItem data={this.state.data}/>
                break;

            case 'vpc':
                infoNode = <VpcItem data={this.state.data}/>
                break;

            case 'subnet':
                infoNode = <SubnetItem data={this.state.data}/>
                break;

            case 'volume':
                infoNode = <VolumeItem data={this.state.data}/>
                break;

            case 'igw':
                infoNode = <IgwItem data={this.state.data}/>
                break;

            case 'peering':
                infoNode = <PeeringItem data={this.state.data}/>

            case 'lb':
                infoNode = <LoadBalancerItem data={this.state.data}/>

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