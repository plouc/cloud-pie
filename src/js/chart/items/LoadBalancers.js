
var icons = require('./../icons');

module.exports = function (clickHandler) {
    return function () {
        var loadBalancers = this.selectAll('.lb')
            .data(d => d.loadBalancers, d => d.name)
        ;

        // Enter
        loadBalancers.enter().append('g')
            .attr('class', 'lb')
            .each(function (lb) {
                var lbEl = d3.select(this);

                var line = d3.svg.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .interpolate('basis')
                ;

                lb.paths.forEach(path => {
                    lbEl.append('path').attr('class', 'lb__link').datum(path).attr('d', line);
                });

                //lb.append('text').text(d => d.name);

                var icon = lbEl.append('g')
                    .attr('transform', `translate(${ lb.box.center.x }, ${ lb.box.center.y })`)
                    .on('click', lb => {
                        clickHandler('lb', lb);
                    })
                ;
                icons.loadBalancer(icon);
            })
        ;

        // Update
        loadBalancers
            .attr('class', lb => `lb${ lb.active ? ' _is-active' : '' }`)
        ;
    };
};