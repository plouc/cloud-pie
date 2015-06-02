var React          = require('react');
var Reflux         = require('reflux');
var FiltersStore   = require('./../../stores/FiltersStore');
var Filter         = require('./Filter.jsx');
var FilterControls = require('./FilterControls.jsx');

module.exports = VpcFilters = React.createClass({
    mixins: [
        Reflux.ListenerMixin
    ],

    getInitialState() {
        return {
            filter: null
        };
    },

    componentWillMount() {
        this.listenTo(FiltersStore, this._onFiltersUpdate);
    },

    _onFiltersUpdate(filters) {
        this.setState({
            filter: filters.vpc.id
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
                <h4 className="filters__title">VPC by ID</h4>
                <FilterControls filter={ this.state.filter }/>
                {filterNodes}
            </div>
        );
    }
});
