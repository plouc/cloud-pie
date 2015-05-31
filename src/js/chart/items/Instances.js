var d3      = require('d3/d3');
var Volumes = require('./Volumes');
var layout  = require('./../Layout');

module.exports = function (clickHandler) {
    return function () {
        var instances = this.selectAll('.instance')
            .data(d => d.instances)
        ;

        // Enter
        instances.enter().append('g')
            .attr('transform', instance => `translate(${ instance.box.origin.x }, ${ instance.box.origin.y })`)
            .attr('class', 'instance')
            .each(function (instance) {
                var instanceEl = d3.select(this);
                var icon = instanceEl.append('rect')
                    .attr('class', 'instance__wrapper')
                    .attr('width',  instance.box.width)
                    .attr('height', instance.box.height)
                    .attr({ rx: layout.instance.borderRadius, ry: layout.instance.borderRadius })
                ;

                icon.on('click', function (instance) {
                    clickHandler('instance', instance);
                });

                instanceEl.append('circle')
                    .attr('class', `instance__state instance__state--${ instance.state }`)
                    .attr('r', layout.instance.stateSize / 2)
                    .attr('cx', 12)
                    .attr('cy', 15)
                ;

                instanceEl.append('text')
                    .attr('class', 'instance__name')
                    .attr('x', 24)
                    .attr('y', 20)
                    .text(instance.tags.name ? instance.tags.name : instance.id)
                ;
            })
        ;

        // Update
        instances
            .attr('class', instance => `instance${ instance.active ? ' _is-active' : '' }`)
        ;

        instances.call(Volumes(clickHandler));
    };
};