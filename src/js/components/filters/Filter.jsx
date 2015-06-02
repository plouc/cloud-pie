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
        var classes     = 'filters__filter';
        var iconClasses = 'fa fa-eye-slash';
        if (this.props.filter.active) {
            classes += ' _is-active';
            iconClasses = 'fa fa-eye';
        }

        return (
            <div className={classes} onClick={this.onClick}>
                <i className={iconClasses}/>
                { this.props.filter.label }
            </div>
        );
    }
});
