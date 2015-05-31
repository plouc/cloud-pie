var d3        = require('d3/d3');
var Instances = require('./Instances');
var layout    = require('./../Layout');

module.exports = function (clickHandler) {
    return function () {
        var subnets = this.selectAll('.subnet')
            .data(vpc => vpc.subnets, subnet => subnet.id)
        ;

        // Enter
        subnets.enter().append('g')
            .attr('class', 'subnet')
            .each(function (subnet) {
                var subnetEl = d3.select(this);

                subnetEl.append('rect')
                    .attr('transform', `translate(${ subnet.box.origin.x }, ${ subnet.box.origin.y })`)
                    .attr('class', 'subnet__wrapper')
                    .attr('width',  subnet.box.width)
                    .attr('height', subnet.box.height)
                    .attr({ rx: layout.subnet.borderRadius, ry: layout.subnet.borderRadius })
                    .on('click', function (d) {
                        clickHandler('subnet', subnet);
                    })
                ;

                subnetEl.append('text')
                    .attr('transform', `translate(${ subnet.box.origin.x + 17 }, ${ subnet.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                    .attr('class', 'subnet__label__text')
                    .attr('text-anchor', 'middle')
                    .text(subnet.tags.name ? subnet.tags.name : subnet.id)
                ;

                subnetEl.append('text')
                    .attr('transform', `translate(${ subnet.box.origin.x + subnet.box.width - 13 }, ${ subnet.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                    .attr('class', 'subnet__zone')
                    .attr('text-anchor', 'middle')
                    .text(subnet.zone)
                ;
            })
        ;

        // Update
        subnets
            .attr('class', subnet => `subnet${ subnet.active ? ' _is-active' : '' }`)
        ;

        subnets.call(Instances(clickHandler));
    };
};