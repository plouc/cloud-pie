var React      = require('react');
var Properties = require('./ItemProperties.jsx');

module.exports = SubnetItem = React.createClass({
    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="item-info__id">{ data.tags.name || data.id }</h3>
                <h4 className="item-info__type">subnet</h4>
                <Properties properties={{
                    id:        data.id,
                    state:     data.state,
                    zone:      data.zone,
                    cidrBlock: data.cidrBlock
                }}/>
                <Properties properties={data.tags}/>
            </div>
        );
    }
});