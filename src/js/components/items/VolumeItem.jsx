import React      from 'react';
import Properties from './ItemProperties.jsx';

export default React.createClass({
    displayName: 'VolumeItem',

    render() {
        var data = this.props.data;
        var ebs  = data.ebs.ebs;

        return (
            <div>
                <h3 className="item-info__id">{ data.deviceName }</h3>
                <h4 className="item-info__type">volume</h4>
                <Properties properties={{
                    'device name': data.deviceName,
                    status:        data.ebs.status,
                    attachTime:    data.ebs.attachTime || '—'
                }}/>
                <h4 className="item-info__type">EBS</h4>
                <Properties properties={{
                    id:                  ebs.id,
                    state:               ebs.state,
                    'availibility zone': ebs.availabilityZone,
                    size:                ebs.size,
                    type:                ebs.type,
                    'created at':        ebs.createdAt,
                    'snapshot id':       ebs.snapshotId,
                    encrypted:           ebs.encrypted ? 'true' : 'false'
                }}/>
                <Properties properties={data.ebs.ebs.tags}/>
            </div>
        );
    }
});
