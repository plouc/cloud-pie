import d3    from 'd3/d3';
import icons from './../icons';

var line = d3.svg.line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('basis')
;

var lbPaths = function () {
    var paths = this.selectAll('.lb__link').data(lb => lb.paths);

    // Enter
    paths.enter().append('path')
        .attr('class', 'lb__link')
        .attr('d', line)
        .style('opacity', 0)
    ;

    // Update
    paths
        .transition()
        .delay(400)
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

export default function (clickHandler) {
    return function () {
        var loadBalancers = this.selectAll('.lb')
            .data(d => d.loadBalancers, d => d.name)
        ;

        // Enter
        loadBalancers.enter().append('g')
            .attr('class', 'lb')
            .each(function (lb) {
                var lbEl = d3.select(this);

                var bottomAnchor = lb.box.anchor('bottom');

                var icon = lbEl.append('g')
                    .attr('class', 'lb__icon')
                    .attr('transform', `translate(${ bottomAnchor.x }, ${ bottomAnchor.y }) scale(0)`)
                    .on('click', () => {
                        clickHandler('lb', lb);
                    })
                ;
                icons.loadBalancer(icon);
            })
            .call(lbPaths)
        ;

        // Update
        loadBalancers
            .attr('class', lb => `lb${ lb.active ? ' _is-active' : '' }`)
            .call(lbPaths)
            .each(function (lb) {
                var lbEl = d3.select(this);

                lbEl.select('.lb__icon')
                    .transition()
                    .delay(400)
                    .duration(900)
                    .ease('elastic')
                    .attr('transform', `translate(${ lb.box.center.x }, ${ lb.box.center.y }) scale(1)`)
                ;
            })
        ;

        // Exit
        loadBalancers.exit()
            .remove()
        ;
    };
}
