var React          = require('react');
var Reflux         = require('reflux');
var FiltersStore   = require('./../../stores/FiltersStore');
var FiltersActions = require('./../../actions/FiltersActions');

module.exports = FilterControls = React.createClass({
    _onSelectNoneClick() {
        FiltersActions.selectNone(this.props.filter);
    },

    _onSelectAllClick() {
        FiltersActions.selectAll(this.props.filter);
    },

    _onToggleClick() {
        FiltersActions.toggle(this.props.filter);
    },

    render() {
        var activeNode;
        if (this.props.filter.active) {
            activeNode = <span className="filters__controls__control" onClick={this._onToggleClick}>disable</span>;
        } else {
            activeNode = <span className="filters__controls__control" onClick={this._onToggleClick}>enable</span>;
        }

        return (
            <div className="filters__controls">
                {activeNode}
                <span className="filters__controls__control" onClick={this._onSelectNoneClick}>none</span>
                <span className="filters__controls__control" onClick={this._onSelectAllClick}>all</span>
            </div>
        );
    }
});
