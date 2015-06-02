import React      from 'react';
import Properties from './ItemProperties.jsx';

export default React.createClass({
    displayName: 'IgwItem',

    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="item-info__id">{ data.id }</h3>
                <h4 className="item-info__type">IGW</h4>
            </div>
        );
    }
});
