import d3        from 'd3/d3';
import instances from './Instances';
import layout    from './../Layout';

export default function (clickHandler) {
    return function () {
        var subnets = this.selectAll('.subnet')
            .data(vpc => vpc.subnets, subnet => subnet.id)
        ;

        // Enter
        subnets.enter().append('g')
            .attr('class', 'subnet')
            .style('opacity', 0)
            .each(function (subnet) {
                var subnetEl = d3.select(this);

                subnetEl.append('rect')
                    .attr('transform', `translate(${ subnet.box.origin.x }, ${ subnet.box.origin.y })`)
                    .attr('class', 'subnet__wrapper')
                    .attr({ width: 10, height: subnet.box.height })
                    .attr({ rx: layout.subnet.borderRadius, ry: layout.subnet.borderRadius })
                    .on('click', () => {
                        clickHandler('subnet', subnet);
                    })
                ;

                subnetEl.append('text')
                    .attr('class', 'subnet__label__text')
                    .attr('text-anchor', 'middle')
                    .text(subnet.tags.name ? subnet.tags.name : subnet.id)
                    .attr('transform', `translate(${ subnet.box.origin.x + 17 }, ${ subnet.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                ;

                subnetEl.append('text')
                    .attr('class', 'subnet__zone')
                    .attr('text-anchor', 'middle')
                    .text(subnet.zone)
                    .attr('transform', `translate(${ subnet.box.origin.x + 17 }, ${ subnet.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                ;
            })
        ;

        // Update
        subnets
            .attr('class', subnet => `subnet${ subnet.active ? ' _is-active' : '' }`)
            .each(function (subnet) {
                var subnetEl = d3.select(this);


                subnetEl.select('.subnet__wrapper')
                    .transition()
                    .delay(200)
                    .duration(400)
                    .attr('transform', `translate(${ subnet.box.origin.x }, ${ subnet.box.origin.y })`)
                    .attr({ width: subnet.box.width, height: subnet.box.height })
                ;

                subnetEl.select('.subnet__label__text')
                    .transition()
                    .delay(200)
                    .duration(400)
                    .attr('transform', `translate(${ subnet.box.origin.x + 17 }, ${ subnet.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                ;

                subnetEl.select('.subnet__zone')
                    .transition()
                    .delay(200)
                    .duration(400)
                    .attr('transform', `translate(${ subnet.box.origin.x + subnet.box.width - 13 }, ${ subnet.box.origin.y + layout.subnet.b.t + layout.instance.size / 2 }) rotate(-90)`)
                ;
            })
            .transition()
            .delay(200)
            .duration(400)
            .style('opacity', 1)
        ;

        // Exit
        subnets.exit()
            .remove()
        ;

        subnets.call(instances(clickHandler));
    };
}
