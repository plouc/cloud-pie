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
        var activeNode, statusNode;
        if (this.props.filter.active) {
            statusNode = (
                <span className="filters__controls__state filters__controls__state--enabled">
                    <i className="fa fa-dot-circle-o"/>
                    enabled
                </span>
            );
            activeNode = <span className="filters__control" onClick={this.onToggleClick}>disable</span>;
        } else {
            statusNode = (
                <span className="filters__controls__state filters__controls__state--disabled">
                    <i className="fa fa-circle-o"/>
                    disabled
                </span>
            );
            activeNode = <span className="filters__control" onClick={this.onToggleClick}>enable</span>;
        }

        return (
            <div className="filters__controls">
                {statusNode}
                {activeNode}
                <span className="filters__controls__text">select:</span>
                <span className="filters__control filters__control--select-all" onClick={this.onSelectAllClick}>all</span>
                <span className="filters__control filters__control--select-none" onClick={this.onSelectNoneClick}>none</span>
            </div>
        );
    }
});
