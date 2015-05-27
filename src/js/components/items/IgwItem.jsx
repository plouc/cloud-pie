var React      = require('react');
var Properties = require('./ItemProperties.jsx');

module.exports = IgwItem = React.createClass({
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