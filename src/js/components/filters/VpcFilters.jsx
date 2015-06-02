import React         from 'react';
import Reflux        from 'reflux';
import FiltersStore  from './../../stores/FiltersStore';
import Filter        from './Filter.jsx';
import FiltersWidget from './FiltersWidget.jsx';

export default React.createClass({
    displayName: 'VpcFilters',

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
            filter: filters.vpc.id
        });
    },

    render() {
        if (this.state.filter === null) { return null; }

        var filterNodes = this.state.filter.filters.map(filter => {
            return <Filter key={ filter.value } filter={ filter } />;
        });

        return (
            <FiltersWidget filter={this.state.filter} title="VPC by ID" filterId="filter.vpc.id">
                {filterNodes}
            </FiltersWidget>
        );
    }
});
