import chart from './../chart/Chart';
import React from 'react';
import _     from 'lodash';

export default React.createClass({
    displayName: 'Chart',

    componentDidMount() {
        var el = this.getDOMNode();
        chart.create(el);
        chart.update(el, this.props.stack.vpcs, this.props.stack.vpcPeerings, {
            clickHandler: this.props.clickHandler || _.noop
        });
    },

    shouldComponentUpdate(data) {
        var el = this.getDOMNode();
        chart.update(el, data.stack.vpcs, data.stack.vpcPeerings, {
            clickHandler: this.props.clickHandler || _.noop
        });

        return false;
    },

    render() {
      return <div className="schema" />;
    }
});
