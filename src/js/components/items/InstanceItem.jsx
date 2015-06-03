import React      from 'react';
import Properties from './ItemProperties.jsx';

export default React.createClass({
    displayName: 'InstanceItem',

    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="panel__title">{ data.tags.name || data.id }</h3>
                <h4 className="item-info__type">EC2 Instance</h4>
                <Properties properties={{
                    id:           data.id,
                    type:         data.type,
                    state:        data.state,
                    'private ip': data.privateIpAddress || '—',
                    'public ip':  data.publicIpAddress || '—'
                }}/>
                <h4 className="item-info__type">Tags</h4>
                <Properties properties={data.tags}/>
            </div>
        );
    }
});
