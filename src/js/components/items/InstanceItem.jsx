var React      = require('react');
var Properties = require('./ItemProperties.jsx');

module.exports = InstanceItem = React.createClass({
    render() {
        var data = this.props.data;

        //console.log(data);

        return (
            <div>
                <h3 className="item-info__id">{ data.tags.name || data.id }</h3>
                <h4 className="item-info__type">EC2 Instance</h4>
                <Properties properties={{
                    id:           data.id,
                    type:         data.type,
                    'private ip': data.privateIpAddress || '—',
                    'public ip':  data.publicIpAddress || '—'
                }}/>
                <Properties properties={data.tags}/>
            </div>
        );
    }
});