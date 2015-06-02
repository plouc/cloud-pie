import React          from 'react';
import Reflux         from 'reflux';
import FiltersStore   from './../../stores/FiltersStore';
import Filter         from './Filter.jsx';
import FilterControls from './FilterControls.jsx';

export default React.createClass({
    displayName: 'InstanceFilters',

    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            filter: null
        };
    },

    componentWillMount() {
        this.listenTo(FiltersStore, this.onFiltersUpdate);
    },

    onFiltersUpdate(filters) {
        this.setState({
            filter: filters.instance.tag
        });
    },

    render() {
        if (this.state.filter === null) {
            return null;
        }

        var filterNodes = this.state.filter.filters.map(filter => {
            return <Filter key={ filter.value } filter={ filter } />;
        });

        return (
            <div>
                <h4 className="filters__title">Instance Tag</h4>
                <FilterControls filter={ this.state.filter }/>
                {filterNodes}
            </div>
        );
    }
});
