import React        from 'react';
import ChartWrapper from './components/ChartWrapper.jsx';
import AwsActions   from './actions/AwsActions';
import InfoPanel    from './components/panels/InfoPanel.jsx';
import FiltersPanel from './components/panels/FiltersPanel.jsx';

var App = React.createClass({
    displayName: 'App',

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
