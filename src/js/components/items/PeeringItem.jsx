var React      = require('react');
var Properties = require('./ItemProperties.jsx');

module.exports = PeeringItem = React.createClass({
    render() {
        var data = this.props.data;

        var req = data.requesterVpcInfo;
        var acc = data.accepterVpcInfo;

        return (
            <div>
                <h3 className="item-info__id">{ data.tags.name || data.id }</h3>
                <h4 className="item-info__type">VPC peering</h4>
                <Properties properties={{
                    id:                        data.id,
                    status:                    data.status,
                    'requester vpc':           req.id,
                    'requester vpc cidrBlock': req.cidrBlock,
                    'accepter vpc':            acc.id,
                    'accepter vpc cidrBlock':  acc.cidrBlock
                }}/>
            </div>
        );
    }
});