var chart = require('./../Chart');
var React = require('react');
var _     = require('lodash');

module.exports = Chart = React.createClass({
    componentDidMount() {
        //console.log('Chart.componentDidMount()');
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