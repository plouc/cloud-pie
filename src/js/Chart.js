var request = require('superagent');
var d3      = require('d3/d3');
var _       = require('lodash');
var icons   = require('./icons');
var Anchor  = require('./Anchor');

// Layout setup
var layout = {
    vpc:         { spacing: 60, b: { t: 120, r: 20, b: 20, l: 20 } },
    autoscaling: { size: 80, spacing: 10 },
    subnet:      { spacing: 24, b: { t: 32,  r: 10, b: 10, l: 10 } },
    instance:    { size: 100, stateSize: 8, spacing: 10, padding: 8 },
    volume:      { size: 32, spacing: 6 }
};

module.exports = {
    create(el) {
        d3.select(el).append('svg')
            .attr('width',  3000)
            .attr('height', 3000)
        .append('g')
            .attr('class', 'schema__wrapper')
            .attr('transform', 'translate(30, 120)')
        ;
    },

    update(el, vpcs, peerings, options) {
        var schema = d3.select(el).select('.schema__wrapper');

        var clickHandler = options.clickHandler || _.noop;

        var vpcX = 0;
        vpcs.forEach(vpc => {
            vpc.subnets       = vpc.subnets.filter(d => d.instances.length > 0);
            vpc.maxInstances  = 0;
            var maxInstSubnet = _.max(vpc.subnets, subnet => subnet.instances.length);
            if (_.isObject(maxInstSubnet)) {
                vpc.maxInstances  = maxInstSubnet.instances.length;
            }

            // pre-compute layout
            vpc.layout = {};
            vpc.layout.width = vpc.maxInstances * layout.instance.size +
                              (vpc.maxInstances - 1) * layout.instance.spacing +
                              layout.vpc.b.l + layout.vpc.b.r +
                              layout.subnet.b.l + layout.subnet.b.r;
            vpc.layout.height = vpc.subnets.length * layout.instance.size +
                                vpc.subnets.length * (layout.subnet.b.t + layout.subnet.b.b + layout.subnet.spacing) - layout.subnet.spacing +
                                layout.vpc.b.t + layout.vpc.b.b;
            vpc.layout.x = vpcX;
            vpcX += vpc.layout.width + layout.vpc.spacing;

            var instances = [];

            vpc.subnets.forEach((subnet, i) => {
                subnet.layout = {
                    x: layout.vpc.b.l,
                    y: i * (layout.instance.size + layout.subnet.b.t + layout.subnet.b.b) + i * layout.subnet.spacing + layout.vpc.b.t,
                    width:  vpc.maxInstances * layout.instance.size +
                           (vpc.maxInstances - 1) * layout.instance.spacing +
                            layout.subnet.b.l + layout.subnet.b.r,
                    height: layout.instance.size + layout.subnet.b.t + layout.subnet.b.b
                };

                subnet.instances.forEach((instance, i) => {
                    instance.layout = {
                        x: subnet.layout.x +
                           i * layout.instance.size +
                           i * layout.instance.spacing + layout.subnet.b.l,
                        y: subnet.layout.y + layout.subnet.b.t,
                        width:  layout.instance.size,
                        height: layout.instance.size
                    };

                    instances.push(instance);
                });
            });

            vpc.autoscalings.forEach((autoscaling, i) => {
                autoscaling.layout = {
                    x: i * (layout.autoscaling.size + layout.autoscaling.spacing) - layout.autoscaling.spacing + 60,
                    y: 60
                };
                autoscaling.layout.anchor = new Anchor({
                    x: autoscaling.layout.x,
                    y: autoscaling.layout.y + 30
                }, {
                    distribute: 'horizontal',
                    spacing:    10
                });

                autoscaling.paths = [];
                autoscaling.instances.forEach(instanceInfo => {
                    if (_.find(instances, { id: instanceInfo.id })) {
                        autoscaling.layout.anchor.add();
                    }
                });
                autoscaling.instances.forEach(instanceInfo => {
                    var instance = _.find(instances, { id: instanceInfo.id });
                    if (instance) {
                        var start = autoscaling.layout.anchor.get();
                        autoscaling.paths.push([
                            start,
                            { x: start.x, y: start.y + 15 },
                            { x: instance.layout.x + instance.layout.width / 2,    y: instance.layout.y - 20   },
                            { x: instance.layout.x + instance.layout.width / 2,    y: instance.layout.y    }
                        ]);
                        autoscaling.layout.anchor.next();
                    }
                });
            });

            vpc.peerings = {
                requests: [],
                accepts:  []
            };

            vpc.layout.peerAnchorReq = new Anchor({
                x: vpc.layout.x + vpc.layout.width / 2,
                y: 0
            }, {
                distribute: 'horizontal'
            });
            vpc.layout.peerAnchorAcc = new Anchor({
                x: vpc.layout.x,
                y: 100
            }, {
                distribute: 'vertical'
            });
        });

        peerings.forEach(peering => {
            var requester = _.find(vpcs, { id: peering.requesterVpcInfo.id });
            var accepter  = _.find(vpcs, { id: peering.accepterVpcInfo.id  });

            if (requester && accepter) {
                requester.peerings.requests.push(peering);
                requester.layout.peerAnchorReq.add();

                accepter.peerings.accepts.push(peering);
                accepter.layout.peerAnchorAcc.add();
            }
        });


        var vpcsNodes = schema.selectAll('.vpc').data(vpcs, d => d.id);
        vpcsNodes.enter().append('g')
            .each(function (d) {
                var vpc = d3.select(this);

                vpc.append('rect')
                    .attr('class', 'vpc__wrapper')
                    .attr('width', d.layout.width)
                    .attr('height', d.layout.height)
                    .attr({ rx: 5, ry: 5 })
                ;

                var vpcIcon = vpc.append('g').attr('transform', 'translate(55, 0)');
                icons.vpc(vpcIcon);
                vpcIcon.append('text')
                    .attr('class', 'vpc__label__text')
                    .attr('text-anchor', 'middle')
                    .attr('y', -46)
                    .text(d.tags.name ? d.tags.name : d.id)
                ;

                vpcIcon.on('click', function (d) {
                    clickHandler('vpc', d);
                });

                if (d.internetGateway !== null) {
                    var igwGroup = vpc.append('g')
                        .attr('class', 'igw')
                        .attr('transform', `translate(${ d.layout.width - 30 - layout.vpc.b.r }, 0)`)
                    ;
                    icons.igw(igwGroup);
                    igwGroup.append('text')
                        .attr('class', 'igw__label__text')
                        .text(d.internetGateway.tags.name ? d.internetGateway.tags.name : d.internetGateway.id)
                        .attr('text-anchor', 'middle')
                        .attr('y', -40)
                    ;

                    igwGroup.on('click', d => {
                        clickHandler('igw', d.internetGateway);
                    });
                }
            })
        ;

        vpcsNodes
            .attr('class', d => `vpc${ d.active ? ' _is-active' : '' }`)
            .attr('transform', d => `translate(${ d.layout.x }, 0)`)
            .each(function (d) {
                var _this = d3.select(this);

                if (d.internetGateway !== null) {
                    var igw = d.internetGateway;
                    _this.selectAll('.igw')
                        .attr('class', d => `igw${ igw.active ? ' _is-active' : '' }`)
                    ;
                }
            })
        ;

        var peeringsData = [];

        var peeringOffsetV = 80;
        peerings.forEach(peering => {
            var requester = _.find(vpcs, { id: peering.requesterVpcInfo.id });
            var accepter  = _.find(vpcs, { id: peering.accepterVpcInfo.id  });

            if (requester && accepter) {
                var start = requester.layout.peerAnchorReq.get();
                var end   = accepter.layout.peerAnchorAcc.get();

                var points = [
                    start,
                    { x: start.x,                        y: start.y -peeringOffsetV },
                    { x: end.x - layout.vpc.spacing / 2, y: start.y -peeringOffsetV },
                    { x: end.x - layout.vpc.spacing / 2, y: end.y },
                    end
                ];

                requester.layout.peerAnchorReq.next();
                accepter.layout.peerAnchorAcc.next();

                peeringOffsetV += 15;

                peeringsData.push({
                    peering: peering,
                    points:  points
                });
            }
        });


        var peeringNodes = schema.selectAll('.vpc__peering')
            .data(peeringsData, d => d.peering.id)
        ;
        peeringNodes.enter().append('g')
            .attr('class', 'vpc__peering')
            .each(function (d) {
                var _this = d3.select(this);

                var line = d3.svg.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .interpolate('linear')
                ;

                _this.append('path').datum(d.points)
                    .attr('class', 'vpc__peering__path')
                    .attr('d', line)
                ;

                var reqIcon = _this.append('g')
                    .attr('class', 'vpc__peering__icon')
                    .attr('transform', `translate(${ d.points[0].x }, ${ d.points[0].y })`)
                ;
                var accIcon = _this.append('g')
                    .attr('class', 'vpc__peering__icon')
                    .attr('transform', `translate(${ d.points[4].x }, ${ d.points[4].y })`)
                ;

                icons.vpcPeering(reqIcon);
                icons.vpcPeering(accIcon);

                reqIcon.on('click', d => { clickHandler('peering', d.peering); });
                accIcon.on('click', d => { clickHandler('peering', d.peering); });
            })
        ;

        peeringNodes
            .attr('class', d => `vpc__peering${ d.peering.active ? ' _is-active' : '' }`)
        ;

        var subnets = vpcsNodes.selectAll('.subnet').data(d => d.subnets, d => d.id);
        subnets.enter().append('g')
            .attr('class', 'subnet')
            .each(function (d) {
                var subnet = d3.select(this);

                subnet.append('rect')
                    .attr('transform', d => `translate(${ d.layout.x }, ${ d.layout.y })`)
                    .attr('class', 'subnet__wrapper')
                    .attr('width',  d.layout.width)
                    .attr('height', d.layout.height)
                    .attr({ rx: 3, ry: 3 })
                    .on('click', function (d) {
                        clickHandler('subnet', d);
                    })
                ;

                subnet.append('text')
                    .attr('transform', d => `translate(${ d.layout.x }, ${ d.layout.y })`)
                    .attr('class', 'subnet__label__text')
                    .attr('x', layout.subnet.b.l)
                    .attr('y', 18)
                    .text(d.tags.name ? d.tags.name : d.id)
                ;

                subnet.append('text')
                    .attr('transform', d => `translate(${ d.layout.x + d.layout.width }, ${ d.layout.y })`)
                    .attr('class', 'subnet__zone')
                    .attr('text-anchor', 'end')
                    .attr('x', -layout.subnet.b.r)
                    .attr('y', 18)
                    .text(d.zone)
                ;
            })
        ;

        subnets
            .attr('class', d => `subnet${ d.active ? ' _is-active' : '' }`)
        ;


        var autoscalings = vpcsNodes.selectAll('.autoscaling').data(d => d.autoscalings, d => d.id);
        autoscalings.enter().append('g')
            .attr('class', 'autoscaling')
            .each(function (d) {
                d.showLinks = false;
                var _this = d3.select(this);

                var line = d3.svg.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .interpolate('step')
                ;

                d.paths.forEach(path => {
                    _this.append('path').attr('class', 'as__instance__link').datum(path).attr('d', line);
                });
                _this.selectAll('.as__instance__link').style('display', 'none');

                var autoscaling = d3.select(this).append('g')
                    .attr('transform', d => `translate(${ d.layout.x }, ${ d.layout.y })`)
                ;
                icons.autoscaling(autoscaling);

                autoscaling.on('click', function (d) {
                    d.showLinks = !d.showLinks;
                    _this.selectAll('.as__instance__link').style('display', d.showLinks ? 'block' : 'none');

                    clickHandler('autoscaling', d);
                });
                autoscaling.on('mouseenter', function (d) {
                    //console.log(d.name || d.id);
                });
            })
        ;


        var instances = subnets.selectAll('.instance').data(d => d.instances);
        instances.enter().append('g')
            .attr('transform', d => `translate(${ d.layout.x }, ${ d.layout.y })`)
            .attr('class', 'instance')
            .each(function (d) {
                var instance = d3.select(this);
                var icon = instance.append('rect')
                    .attr('class', 'instance__wrapper')
                    .attr('width',  d.layout.width)
                    .attr('height', d.layout.height)
                    .attr({ rx: 3, ry: 3 })
                ;

                icon.on('click', function (d) {
                    clickHandler('instance', d);
                });

                instance.append('circle')
                    .attr('class', `instance__state instance__state--${ d.state }`)
                    .attr('r', layout.instance.stateSize / 2)
                    .attr('cx', 12)
                    .attr('cy', 15)
                ;

                instance.append('text')
                    .attr('class', 'instance__name')
                    .attr('x', 24)
                    .attr('y', 20)
                    .text(d.tags.name ? d.tags.name : d.id)
                ;
            })
        ;

        instances
            .attr('class', d => `instance${ d.active ? ' _is-active' : '' }`)
        ;

        var volumes = instances.selectAll('.volume').data(d => d.blockDeviceMappings);
        volumes.enter().append('g')
            .attr('class', 'volume')
            .attr('transform', (d, i) => {
                return `translate(${ i * layout.volume.size + i * layout.volume.spacing + layout.instance.padding }, ${ layout.instance.size - layout.volume.size - layout.instance.padding })`;
            })
            .each(function (d) {
                var volume = d3.select(this);
                volume.append('rect')
                    .attr('class', 'volume__wrapper')
                    .attr('width',  layout.volume.size)
                    .attr('height', layout.volume.size)
                    .attr({ rx: 2, ry: 2 })
                ;

                volume.append('text')
                    .attr('class', 'volume__label__text')
                    .attr('text-anchor', 'middle')
                    .attr('x', layout.volume.size / 2)
                    .attr('y', 17)
                    .text(d.ebs.ebs.size)
                ;

                volume.on('click', d => {
                    clickHandler('volume', d);
                });
            })
        ;
    }
};