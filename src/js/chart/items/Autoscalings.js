var d3    = require('d3/d3');
var icons = require('./../icons');

var line = d3.svg.line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('basis')
;

var autoscalingPaths = function (d, i) {
    var paths = this.selectAll('.autoscaling__link')
        .data(autoscaling => autoscaling.paths)
    ;

    // Enter
    paths.enter().append('path')
        .attr('class', 'autoscaling__link')
        .attr('d', line)
        .style('opacity', 0)
    ;

    // Update
    paths
        .transition()
        .delay(500)
        .duration(900)
        .ease('elastic')
        .attr('d', line)
        .style('opacity', 1)
    ;

    // Exit
    paths.exit()
        .remove()
    ;
};

module.exports = function (clickHandler) {
    return function () {
        var autoscalings = this.selectAll('.autoscaling')
            .data(d => d.autoscalings, d => d.name)
        ;

        // Enter
        autoscalings.enter().append('g')
            .attr('class', 'autoscaling')
            .each(function (autoscaling) {
                var autoscalingEl = d3.select(this);

                var bottomAnchor = autoscaling.box.anchor('bottom');

                var icon = autoscalingEl.append('g')
                    .attr('class', 'autoscaling__icon')
                    .attr('transform', `translate(${ bottomAnchor.x }, ${ bottomAnchor.y }) scale(0)`)
                    .style('opacity', 0)
                    .on('click', autoscaling => {
                        clickHandler('autoscaling', autoscaling);
                    })
                ;
                icons.autoscaling(icon);
            })
            .call(autoscalingPaths)
        ;

        // Update
        autoscalings
            .attr('class', autoscaling => `autoscaling${ autoscaling.active ? ' _is-active' : '' }`)
            .call(autoscalingPaths)
            .each(function (autoscaling) {
                var autoscalingEl = d3.select(this);

                autoscalingEl.select('.autoscaling__icon')
                    .transition()
                    .delay(500)
                    .duration(900)
                    .ease('elastic')
                    .attr('transform', `translate(${ autoscaling.box.center.x }, ${ autoscaling.box.center.y }) scale(1)`)
                    .style('opacity', 1)
                ;
            })
        ;

        // Exit
        autoscalings.exit()
            .remove()
        ;
    };
};