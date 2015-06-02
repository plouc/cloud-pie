var React          = require('react');
var Reflux         = require('reflux');
var FiltersActions = require('./../../actions/FiltersActions');

module.exports = Filter = React.createClass({
    _onClick() {
        FiltersActions.toggle(this.props.filter);
    },

    render() {
        var classes = 'filters__filter';
        if (this.props.filter.active) {
            classes += ' _is-active';
        }

        return (
            <div className={classes} onClick={this._onClick}>{ this.props.filter.label }</div>
        );
    }
});
