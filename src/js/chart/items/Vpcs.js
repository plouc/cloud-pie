import d3            from 'd3/d3';
import layout        from './../Layout';
import icons         from './../icons';
import subnets       from './Subnets';
import loadBalancers from './LoadBalancers';
import autoscalings  from './Autoscalings';


export default function (data, clickHandler) {
    return function () {
        var vpcsNodes = this.selectAll('.vpc')
            .data(data, d => d.id)
        ;

        // Enter
        vpcsNodes.enter().append('g')
            .attr('transform', d => `translate(${ d.box.origin.x }, 0)`)
            .each(function (vpc) {
                var vpcEl = d3.select(this);

                vpcEl.append('rect')
                    .attr('class', 'vpc__wrapper')
                    .attr({ width: 10, height: 10 })
                    .attr({ rx: layout.vpc.borderRadius, ry: layout.vpc.borderRadius })
                    .on('click', () => {
                        clickHandler('vpc', vpc);
                    })
                ;

                var vpcIcon = vpcEl.append('g').attr('transform', 'translate(36, 30)');
                icons.vpc(vpcIcon);
                vpcIcon.append('text')
                    .attr('class', 'vpc__label__text')
                    .attr('text-anchor', 'start')
                    .attr('x', 24)
                    .attr('y', 5)
                    .text(vpc.tags.name ? vpc.tags.name : vpc.id)
                ;

                vpcIcon.on('click', () => {
                    clickHandler('vpc', vpc);
                });

                if (vpc.internetGateway !== null) {
                    var igwGroup = vpcEl.append('g')
                        .attr('class', 'igw')
                        .attr('transform', `translate(${ vpc.box.width - 30 - layout.vpc.b.r }, 0)`)
                    ;
                    icons.igw(igwGroup);
                    igwGroup.append('text')
                        .attr('class', 'igw__label__text')
                        .text(vpc.internetGateway.tags.name ? vpc.internetGateway.tags.name : vpc.internetGateway.id)
                        .attr('text-anchor', 'middle')
                        .attr('y', -40)
                    ;

                    igwGroup.on('click', () => {
                        clickHandler('igw', vpc.internetGateway);
                    });
                }
            })
        ;

        // Update
        vpcsNodes
            .attr('class', d => `vpc${ d.active ? ' _is-active' : '' }`)
            .each(function (vpc) {
                var vpcEl = d3.select(this);

                vpcEl.select('.vpc__wrapper')
                    .transition()
                    .duration(400)
                    .attr('width', vpc.box.width)
                    .attr('height', vpc.box.height)
                ;

                if (vpc.internetGateway !== null) {
                    var igw = vpc.internetGateway;
                    vpcEl.selectAll('.igw')
                        .attr('class', `igw${ igw.active ? ' _is-active' : '' }`)
                        .transition()
                        .duration(400)
                        .attr('transform', `translate(${ vpc.box.width - 30 - layout.vpc.b.r }, 0)`)
                    ;
                }
            })
            .transition()
            .duration(400)
            .attr('transform', vpc => `translate(${ vpc.box.origin.x }, 0)`)
        ;

        // Exit
        vpcsNodes.exit()
            .remove()
        ;

        vpcsNodes.call(subnets(clickHandler));
        vpcsNodes.call(autoscalings(clickHandler));
        vpcsNodes.call(loadBalancers(clickHandler));
    };
}
