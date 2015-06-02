import React          from 'react';
import FiltersActions from './../../actions/FiltersActions';

export default React.createClass({
    displayName: 'Filter',

    propTypes: {
        filter: React.PropTypes.shape({
            label:  React.PropTypes.string,
            active: React.PropTypes.boolean
        }).isRequired
    },

    onClick() {
        FiltersActions.toggle(this.props.filter);
    },

    render() {
        var classes = 'filters__filter';
        if (this.props.filter.active) {
            classes += ' _is-active';
        }

        return (
            <div className={classes} onClick={this.onClick}>{ this.props.filter.label }</div>
        );
    }
});
