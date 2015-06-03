import React from 'react';

export default React.createClass({
    displayName: 'Header',

    render() {
        return (
            <div className="header">
                <span className="header__brand">
                    Cloud
                    <span className="header__brand__pie">Pie</span>
                </span>
            </div>
        );
    }
});