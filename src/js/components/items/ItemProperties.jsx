var React = require('react');
var _     = require('lodash');

module.exports = ItemProperties = React.createClass({
    render() {
        var properties = this.props.properties;

        var nodes = [];
        _.forOwn(properties, (value, key) => {
            nodes.push(
                <li className="item-props__prop" key={key}>
                    <span className="item-props__key">{ key }</span>
                    <span className="item-props__value">{ value }</span>
                </li>
            );
        });

        return (
            <ul className="item-props">{nodes}</ul>
        );
    }
});