import React         from 'react';
import Reflux        from 'reflux';
import FiltersStore  from './../../stores/FiltersStore';
import Filter        from './Filter.jsx';
import FiltersWidget from './FiltersWidget.jsx';

export default React.createClass({
    displayName: 'CloudFormationFilters',

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
            filter: filters.cloudFormation.id
        });
    },

    render() {
        if (this.state.filter === null) { return null; }

        var filterNodes = this.state.filter.filters.map(filter => {
            return <Filter key={ filter.value } filter={ filter } />;
        });

        return (
            <FiltersWidget filter={this.state.filter}>
                {filterNodes}
            </FiltersWidget>
        );
    }
});
