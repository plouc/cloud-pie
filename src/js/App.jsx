var React        = require('react');
var ChartWrapper = require('./components/ChartWrapper.jsx');
var AwsActions   = require('./actions/AwsActions');
var InfoPanel    = require('./components/panels/InfoPanel.jsx');

var App = React.createClass({
    render() {
        return (
            <div>
                <ChartWrapper/>
                <InfoPanel/>
            </div>
        );
    }
});

AwsActions.fetch();

React.render(<App/>, document.getElementById('app'));