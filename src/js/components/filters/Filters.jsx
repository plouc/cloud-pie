import React                 from 'react';
import VpcFilters            from './VpcFilters.jsx';
import CloudFormationFilters from './CloudFormationFilters.jsx';

export default React.createClass({
    displayName: 'Filters',

    render() {
        return (
            <div>
                <VpcFilters/>
                <CloudFormationFilters/>
            </div>
        );
    }
});
