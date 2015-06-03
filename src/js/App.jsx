import React        from 'react';
import ChartWrapper from './components/ChartWrapper.jsx';
import AwsActions   from './actions/AwsActions';
import InfoPanel    from './components/panels/InfoPanel.jsx';
import FiltersPanel from './components/panels/FiltersPanel.jsx';
import Header       from './components/Header.jsx';

var App = React.createClass({
    displayName: 'App',

    render() {
        return (
            <div>
                <ChartWrapper/>
                <FiltersPanel/>
                <InfoPanel/>
                <Header/>
            </div>
        );
    }
});

AwsActions.fetch();

React.render(<App/>, document.getElementById('app'));
