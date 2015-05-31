var d3    = require('d3/d3');
var icons = require('./../icons');

module.exports = function (data, clickHandler) {
    return function () {
        var peeringNodes = this.selectAll('.vpc__peering')
            .data(data, d => d.peering.id)
        ;

        // Enter
        peeringNodes.enter().append('g')
            .attr('class', 'vpc__peering')
            .each(function (d) {
                var _this = d3.select(this);

                var line = d3.svg.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .interpolate('linear')
                ;

                _this.append('path')
                    .datum(d.points)
                    .attr('class', 'vpc__peering__path')
                    .attr('d', line)
                ;

                var reqIcon = _this.append('g')
                    .attr('class', 'vpc__peering__icon')
                    .attr('transform', `translate(${ d.points[0].x }, ${ d.points[0].y })`)
                ;

                var accIcon = _this.append('g')
                    .attr('class', 'vpc__peering__icon')
                    .attr('transform', `translate(${ d.points[4].x }, ${ d.points[4].y })`)
                ;

                icons.vpcPeering(reqIcon);
                icons.vpcPeering(accIcon);

                reqIcon.on('click', d => { clickHandler('peering', d.peering); });
                accIcon.on('click', d => { clickHandler('peering', d.peering); });
            })
        ;

        // Update
        peeringNodes
            .attr('class', d => `vpc__peering${ d.peering.active ? ' _is-active' : '' }`)
        ;
    };
};