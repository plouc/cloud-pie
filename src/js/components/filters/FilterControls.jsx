import React          from 'react';
import FiltersActions from './../../actions/FiltersActions';

export default React.createClass({
    displayName: 'FilterControls',

    propTypes: {
        filter: React.PropTypes.shape({
            active: React.PropTypes.boolean
        }).isRequired
    },

    onSelectNoneClick() {
        FiltersActions.selectNone(this.props.filter);
    },

    onSelectAllClick() {
        FiltersActions.selectAll(this.props.filter);
    },

    onToggleClick() {
        FiltersActions.toggle(this.props.filter);
    },

    render() {
        var activeNode;
        if (this.props.filter.active) {
            activeNode = <span className="filters__controls__control" onClick={this.onToggleClick}>disable</span>;
        } else {
            activeNode = <span className="filters__controls__control" onClick={this.onToggleClick}>enable</span>;
        }

        return (
            <div className="filters__controls">
                {activeNode}
                <span className="filters__controls__control" onClick={this.onSelectNoneClick}>none</span>
                <span className="filters__controls__control" onClick={this.onSelectAllClick}>all</span>
            </div>
        );
    }
});
