var React                 = require('react');
var VpcFilters            = require('./VpcFilters.jsx');
var InstanceFilters       = require('./InstanceFilters.jsx');
var CloudFormationFilters = require('./CloudFormationFilters.jsx');

module.exports = Filters = React.createClass({
    render() {

        //<InstanceFilters/>

        return (
            <div>
                <VpcFilters/>
                <CloudFormationFilters/>
            </div>
        );
    }
});