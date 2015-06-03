import React      from 'react';
import Properties from './ItemProperties.jsx';

export default React.createClass({
    displayName: 'VpcItem',

    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="panel__title">{ data.tags.name || data.id }</h3>
                <h4 className="item-info__type">VPC</h4>
                <Properties properties={{
                    id:        data.id,
                    cidrBlock: data.cidrBlock
                }}/>
                <Properties properties={data.tags}/>
            </div>
        );
    }
});
