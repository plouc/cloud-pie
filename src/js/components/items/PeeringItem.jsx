import React      from 'react';
import Properties from './ItemProperties.jsx';

export default React.createClass({
    displayName: 'PeeringItem',

    render() {
        var data = this.props.data;

        var req = data.requesterVpcInfo;
        var acc = data.accepterVpcInfo;

        return (
            <div>
                <h3 className="panel__title">{ data.tags.name || data.id }</h3>
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
