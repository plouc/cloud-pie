import React      from 'react';
import Properties from './ItemProperties.jsx';

export default React.createClass({
    displayName: 'LoadBalancerItem',

    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="panel__title">{ data.name }</h3>
                <h4 className="item-info__type">ELB</h4>
                <Properties properties={{
                    'dns name':   data.dnsName,
                    'created at': data.createdAt,
                    scheme:       data.scheme
                }}/>
            </div>
        );
    }
});
