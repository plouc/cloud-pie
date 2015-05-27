var React      = require('react');
var Properties = require('./ItemProperties.jsx');

module.exports = LoadBalancerItem = React.createClass({
    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="item-info__id">{ data.name }</h3>
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