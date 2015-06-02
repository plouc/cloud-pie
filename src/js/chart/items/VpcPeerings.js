var d3    = require('d3/d3');
var icons = require('./../icons');

module.exports = function (data, clickHandler) {
    return function () {
        var line = d3.svg.line()
            .x(d => d.x)
            .y(d => d.y)
            .interpolate('linear')
        ;

        var peeringNodes = this.selectAll('.vpc__peering')
            .data(data, d => d.peering.id)
        ;

        // Enter
        peeringNodes.enter().append('g')
            .attr('class', 'vpc__peering')
            .each(function (peering) {
                var _this = d3.select(this);

                _this.append('path')
                    .datum(peering.points)
                    .attr('class', 'vpc__peering__path')
                    .attr('d', line)
                ;

                var reqIcon = _this.append('g')
                    .attr('class', 'vpc__peering__icon vpc__peering__icon--req')
                    .attr('transform', `translate(${ peering.points[0].x }, ${ peering.points[0].y })`)
                ;

                var accIcon = _this.append('g')
                    .attr('class', 'vpc__peering__icon vpc__peering__icon--acc')
                    .attr('transform', `translate(${ peering.points[4].x }, ${ peering.points[4].y })`)
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
            .each(function (peering) {
                var _this = d3.select(this);
                _this.select('.vpc__peering__path')
                    .datum(peering.points)
                .transition().duration(400)
                    .attr('d', line)
                ;

                _this.select('.vpc__peering__icon--req')
                    .transition().duration(400)
                    .attr('transform', `translate(${ peering.points[0].x }, ${ peering.points[0].y })`)
                ;

                _this.select('.vpc__peering__icon--acc')
                    .transition().duration(400)
                    .attr('transform', `translate(${ peering.points[4].x }, ${ peering.points[4].y })`)
                ;
            })
        ;

        // Exit
        peeringNodes.exit()
            .remove()
        ;
    };
};