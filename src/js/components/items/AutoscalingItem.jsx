var React      = require('react');
var Properties = require('./ItemProperties.jsx');

module.exports = AutoscalingItem = React.createClass({
    render() {
        var data = this.props.data;

        return (
            <div>
                <h3 className="item-info__id">{ data.name || data.id }</h3>
                <h4 className="item-info__type">Autoscaling Group</h4>
                <Properties properties={{
                    'min size': data.minSize,
                    'max size': data.maxSize
                }}/>
            </div>
        );
    }
});