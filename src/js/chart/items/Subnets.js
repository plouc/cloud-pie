var d3        = require('d3/d3');
var Instances = require('./Instances');
var layout    = require('./../Layout');

module.exports = function (clickHandler) {
    return function () {
        var subnets = this.selectAll('.subnet')
            .data(d => d.subnets, d => d.id)
        ;

        // Enter
        subnets.enter().append('g')
            .attr('class', 'subnet')
            .each(function (d) {
                var subnet = d3.select(this);

                subnet.append('rect')
                    .attr('transform', d => `translate(${ d.box.origin.x }, ${ d.box.origin.y })`)
                    .attr('class', 'subnet__wrapper')
                    .attr('width',  d.layout.width)
                    .attr('height', d.box.height)
                    .attr({ rx: layout.subnet.borderRadius, ry: layout.subnet.borderRadius })
                    .on('click', function (d) {
                        clickHandler('subnet', d);
                    })
                ;

                subnet.append('text')
                    .attr('transform', d => `translate(${ d.box.origin.x + 17 }, ${ d.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                    .attr('class', 'subnet__label__text')
                    .attr('text-anchor', 'middle')
                    .text(d.tags.name ? d.tags.name : d.id)
                ;

                subnet.append('text')
                    .attr('transform', d => `translate(${ d.box.origin.x + d.layout.width - 13 }, ${ d.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                    .attr('class', 'subnet__zone')
                    .attr('text-anchor', 'middle')
                    .text(d.zone)
                ;
            })
        ;

        // Update
        subnets
            .attr('class', d => `subnet${ d.active ? ' _is-active' : '' }`)
        ;

        subnets.call(Instances(clickHandler));
    };
};