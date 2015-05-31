var d3    = require('d3/d3');
var icons = require('./../icons');

module.exports = function (clickHandler) {
    return function () {
        var autoscalings = this.selectAll('.autoscaling')
            .data(d => d.autoscalings, d => d.name)
        ;

        // Enter
        autoscalings.enter().append('g')
            .attr('class', 'autoscaling')
            .each(function (autoscaling) {
                autoscaling.showLinks = false;
                var _this = d3.select(this);

                var line = d3.svg.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .interpolate('basis')
                ;

                autoscaling.paths.forEach(path => {
                    _this.append('path')
                        .attr('class', 'autoscaling__link')
                        .datum(path)
                        .attr('d', line)
                    ;
                });


                var icon = _this.append('g')
                    .attr('transform', `translate(${ autoscaling.box.center.x }, ${ autoscaling.box.center.y })`)
                    .on('click', autoscaling => {
                        clickHandler('autoscaling', autoscaling);
                    })
                ;
                icons.autoscaling(icon);
            })
        ;

        // Update
        autoscalings
            .attr('class', autoscaling => `autoscaling${ autoscaling.active ? ' _is-active' : '' }`)
        ;
    };
};