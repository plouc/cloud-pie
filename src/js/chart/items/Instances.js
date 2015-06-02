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
            .attr('transform', instance => `translate(${ instance.box.center.x }, ${ instance.box.center.y })`)
            .attr('class', 'instance')
            .style('opacity', 0)
            .each(function (instance) {
                var instanceEl = d3.select(this);

                var icon = instanceEl.append('rect')
                    .attr('class', 'instance__wrapper')
                    .attr({ width: 1, height: 1 })
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
            .each(function (instance, i) {
                var instanceEl = d3.select(this);

                instanceEl.select('.instance__wrapper')
                    .transition()
                    .delay(i * 60 + 400)
                    .duration(900)
                    .ease('elastic')
                    .attr({ width: instance.box.width, height: instance.box.height })
                ;
            })
            .transition()
            .delay((d, i) => i * 60 + 400)
            .duration(900)
            .ease('elastic')
            .style('opacity', 1)
            .attr('transform', instance => `translate(${ instance.box.origin.x }, ${ instance.box.origin.y })`)
        ;

        // Exit
        instances.exit()
            .remove()
        ;

        instances.call(Volumes(clickHandler));
    };
};