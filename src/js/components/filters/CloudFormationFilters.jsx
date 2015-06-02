var React          = require('react');
var Reflux         = require('reflux');
var FiltersStore   = require('./../../stores/FiltersStore');
var Filter         = require('./Filter.jsx');
var FilterControls = require('./FilterControls.jsx');

module.exports = CloudFormationFilters = React.createClass({
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
            filter: filters.cloudFormation.id
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
                <h4 className="filters__title">CloudFormation stack</h4>
                <FilterControls filter={ this.state.filter }/>
                {filterNodes}
            </div>
        );
    }
});
