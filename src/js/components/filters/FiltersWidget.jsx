import React              from 'react';
import Reflux             from 'reflux';
import CollapsibleStore   from './../../stores/CollapsibleStore';
import CollapsibleActions from './../../actions/CollapsibleActions';
import FilterControls     from './FilterControls.jsx';

export default React.createClass({
    displayName: 'FiltersWidget',

    mixins: [
        Reflux.ListenerMixin
    ],

    propTypes: {
        filter: React.PropTypes.shape({
            id:    React.PropTypes.string.isRequired,
            label: React.PropTypes.string.isRequired
        }).isRequired
    },

    getInitialState() {
        return {
            opened: CollapsibleStore.get(this.props.filter.id)
        };
    },

    componentWillMount() {
        this.listenTo(CollapsibleStore, this.onCollapseUpdate);
    },

    onCollapseUpdate(id: string, state: boolean) {
        if (id !== this.props.filter.id) { return; }

        this.setState({
            opened: state
        });
    },

    onToggleClick() {
        CollapsibleActions.toggle(this.props.filter.id);
    },

    render() {
        var classes = `filters__widget${ this.state.opened ? ' _is-opened' : '' }`;

        return (
            <div className={classes}>
                <h4 className="filters__widget__title" onClick={this.onToggleClick}>{this.props.filter.label}</h4>
                <div className="filters__widget__body">
                    <FilterControls filter={this.props.filter}/>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
