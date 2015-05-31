var d3            = require('d3/d3');
var layout        = require('./../Layout');
var icons         = require('./../icons');
var Subnets       = require('./Subnets');
var LoadBalancers = require('./LoadBalancers');
var Autoscalings  = require('./Autoscalings');


module.exports = function (data, clickHandler) {
    return function () {
        var vpcsNodes = this.selectAll('.vpc')
            .data(data, d => d.id)
        ;

        // Enter
        vpcsNodes.enter().append('g')
            .each(function (d) {
                var vpc = d3.select(this);

                vpc.append('rect')
                    .attr('class', 'vpc__wrapper')
                    .attr('width', d.box.width)
                    .attr('height', d.box.height)
                    .attr({ rx: layout.vpc.borderRadius, ry: layout.vpc.borderRadius })
                ;

                var vpcIcon = vpc.append('g').attr('transform', 'translate(36, 30)');
                icons.vpc(vpcIcon);
                vpcIcon.append('text')
                    .attr('class', 'vpc__label__text')
                    .attr('text-anchor', 'start')
                    .attr('x', 24)
                    .attr('y', 5)
                    .text(d.tags.name ? d.tags.name : d.id)
                ;

                vpcIcon.on('click', function (d) {
                    clickHandler('vpc', d);
                });

                if (d.internetGateway !== null) {
                    var igwGroup = vpc.append('g')
                            .attr('class', 'igw')
                            .attr('transform', `translate(${ d.box.width - 30 - layout.vpc.b.r }, 0)`)
                        ;
                    icons.igw(igwGroup);
                    igwGroup.append('text')
                        .attr('class', 'igw__label__text')
                        .text(d.internetGateway.tags.name ? d.internetGateway.tags.name : d.internetGateway.id)
                        .attr('text-anchor', 'middle')
                        .attr('y', -40)
                    ;

                    igwGroup.on('click', d => {
                        clickHandler('igw', d.internetGateway);
                    });
                }
            })
        ;

        // Update
        vpcsNodes
            .attr('class', d => `vpc${ d.active ? ' _is-active' : '' }`)
            .attr('transform', d => `translate(${ d.box.origin.x }, 0)`)
            .each(function (d) {
                var _this = d3.select(this);

                if (d.internetGateway !== null) {
                    var igw = d.internetGateway;
                    _this.selectAll('.igw')
                        .attr('class', d => `igw${ igw.active ? ' _is-active' : '' }`)
                    ;
                }
            })
        ;

        vpcsNodes.call(Subnets(clickHandler));
        vpcsNodes.call(Autoscalings(clickHandler));
        vpcsNodes.call(LoadBalancers(clickHandler));
    };
};