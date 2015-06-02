var React        = require('react');
var ChartWrapper = require('./components/ChartWrapper.jsx');
var AwsActions   = require('./actions/AwsActions');
var InfoPanel    = require('./components/panels/InfoPanel.jsx');
var FiltersPanel = require('./components/panels/FiltersPanel.jsx');

var App = React.createClass({
    render() {
        return (
            <div>
                <ChartWrapper/>
                <FiltersPanel/>
                <InfoPanel/>
            </div>
        );
    }
});

AwsActions.fetch();

React.render(<App/>, document.getElementById('app'));