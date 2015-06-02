var d3            = require('d3/d3');
var _             = require('lodash');
var layout        = require('./Layout');
var Anchor        = require('./../geom/Anchor');
var Box           = require('./../geom/Box');
var Point         = require('./../geom/Point');
var Path          = require('./../geom/Path');
var VpcPeerings   = require('./items/VpcPeerings');
var Vpcs          = require('./items/Vpcs');


module.exports = {
    create(el) {
        var schema = d3.select(el).append('svg')
            // @todo compute required dimensions
            .attr('width',  3000)
            .attr('height', 3000)
        .append('g')
            .attr('class', 'schema__wrapper')
            .attr('transform', 'translate(30, 120)')
        ;

        var defs = schema.append('defs');

        /*
        defs.append('marker')
            .attr('id', 'myMarker')
            .attr('orient', 'auto')
            .attr('viewBox', '0 0 5 8')
            .attr({ refX: 4, refY: 4 })
            //.attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', 5)
            .attr('markerHeight', 8)
        .append('polyline')
            .attr('points', '1,1 4,4 1,7')
            .attr('class', 'arrow-marker')
            .attr('fill', 'none')
            .attr('stroke', 'context-stroke')
        ;
        */
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
                vpc.maxInstances = maxInstSubnet.instances.length;
            }

            vpc.box = new Box();
            vpc.box.setDimensions(
                vpc.maxInstances * layout.instance.size +
                (vpc.maxInstances - 1) * layout.instance.spacing +
                layout.vpc.b.l + layout.vpc.b.r +
                layout.subnet.b.l + layout.subnet.b.r,
                vpc.subnets.length * layout.instance.size +
                vpc.subnets.length * (layout.subnet.b.t + layout.subnet.b.b + layout.subnet.spacing) - layout.subnet.spacing +
                layout.vpc.b.t + layout.vpc.b.b
            );
            vpc.box.setOrigin(new Point(vpcX, 0));
            vpcX += vpc.box.width + layout.vpc.spacing;

            var instances = [];

            vpc.subnets.sort((a, b) => b.instances.length - a.instances.length);

            var remainingSubnets = vpc.subnets.slice(0);
            var subnetRows = [{
                remaining: vpc.maxInstances,
                subnets:   []
            }];
            var currentSubnetRow = subnetRows[0];

            var done = false;
            while (done !== true) {
                if (remainingSubnets.length === 0) {
                    done = true;
                } else {
                    var minLength = _.min(_.map(vpc.subnets, subnet => subnet.instances.length));

                    if (currentSubnetRow.remaining === 0) {
                        currentSubnetRow = {
                            remaining: vpc.maxInstances,
                            subnets:   []
                        };
                        subnetRows.push(currentSubnetRow);
                    }

                    if (minLength > currentSubnetRow.remaining) {
                        currentSubnetRow = {
                            remaining: vpc.maxInstances,
                            subnets:   []
                        };
                        subnetRows.push(currentSubnetRow);
                    }

                    for (var i = 0; i < remainingSubnets.length; i++) {
                        var subnet = remainingSubnets[i];
                        if (subnet.instances.length <= currentSubnetRow.remaining) {
                            currentSubnetRow.subnets.push(remainingSubnets.splice(i, 1)[0]);
                            currentSubnetRow.remaining -= subnet.instances.length;
                            break;
                        }
                    }
                }
            }

            subnetRows.forEach((row, rowIndex) => {
                row.subnets.forEach((subnet, i) => {
                    subnet.box = new Box();

                    var x = layout.vpc.b.l;
                    if (i > 0) {
                        x += row.subnets[i - 1].box.origin.x + row.subnets[i - 1].box.width
                    }

                    subnet.box.setOrigin(new Point(
                        x,
                        rowIndex * (layout.instance.size + layout.subnet.b.t + layout.subnet.b.b) +
                        rowIndex * layout.subnet.spacing + layout.vpc.b.t
                    ));

                    subnet.box.setDimensions(
                        subnet.instances.length * layout.instance.size +
                        (subnet.instances.length - 1) * layout.instance.spacing +
                        layout.subnet.b.l + layout.subnet.b.r,
                        layout.instance.size + layout.subnet.b.t + layout.subnet.b.b
                    );

                    subnet.instances.forEach((instance, i) => {
                        instance.box = new Box();
                        instance.box
                            .setOrigin(new Point(
                                subnet.box.origin.x +
                                i * layout.instance.size +
                                i * layout.instance.spacing + layout.subnet.b.l,
                                subnet.box.origin.y + layout.subnet.b.t
                            ))
                            .setDimensions(layout.instance.size, layout.instance.size)
                        ;

                        instances.push(instance);
                    });
                });
            });

            vpc.box.setDimensions(
                vpc.box.width,
                subnetRows.length * layout.instance.size +
                subnetRows.length * (layout.subnet.b.t + layout.subnet.b.b + layout.subnet.spacing) - layout.subnet.spacing +
                layout.vpc.b.t + layout.vpc.b.b
            );

            vpc.autoscalings.forEach((autoscaling) => {
                var asInstances = [];
                var instance;
                var instancePoints = [];

                autoscaling.instances.forEach(instanceInfo => {
                    instance = _.find(instances, { id: instanceInfo.id });
                    if (instance) {
                        asInstances.push(instance);
                        instancePoints.push(instance.box.center);
                    }
                });

                autoscaling.box = new Box();
                autoscaling.box.setDimensions(
                    layout.autoscaling.size,
                    layout.autoscaling.size
                );

                if (asInstances.length === 1) {
                    autoscaling.box.setCenter(
                        asInstances[0].box.center.clone()
                            .offset(layout.autoscaling.offset.x, asInstances[0].box.height * -0.5 + layout.autoscaling.offset.y)
                    );
                } else {
                    autoscaling.box.setCenter(
                        Point
                            .centerFromPoints(instancePoints)
                            .offset(layout.autoscaling.offset.x, 0)
                    );
                }

                autoscaling.paths = [];
                asInstances.forEach(instance => {
                    autoscaling.paths.push(Path.fromBoxes(autoscaling.box, instance.box, 10, 10).points);
                });
            });

            vpc.autoscalings = _.filter(vpc.autoscalings, autoscaling => autoscaling.paths.length > 0);

            vpc.peerings = {
                requests: [],
                accepts:  []
            };

            vpc.peerAnchorReq = new Anchor({
                x: vpc.box.origin.x + vpc.box.width / 2,
                y: 0
            }, {
                distribute: 'horizontal'
            });
            vpc.peerAnchorAcc = new Anchor({
                x: vpc.box.origin.x,
                y: 100
            }, {
                distribute: 'vertical'
            });

            vpc.loadBalancers.forEach(lb => {
                var lbInstances = [];
                var instance;
                var instancePoints = [];
                lb.instancesIds.forEach(instanceId => {
                    instance = _.find(instances, { id: instanceId });
                    if (instance) {
                        lbInstances.push(instance);
                        instancePoints.push(instance.box.center);
                    }
                });

                lb.box = new Box();
                lb.box.setDimensions(layout.lb.size, layout.lb.size);


                if (lbInstances.length === 1) {
                    lb.box.setCenter(
                        lbInstances[0].box.center.clone()
                            .offset(layout.lb.offset.x, lbInstances[0].box.height * -0.5 + layout.lb.offset.y)
                    );
                } else {
                    lb.box.setCenter(
                        Point
                            .centerFromPoints(instancePoints)
                            .offset(layout.lb.offset.x, 0)
                    );
                }

                lb.paths = [];
                lbInstances.forEach(instance => {
                    lb.paths.push(Path.fromBoxes(lb.box, instance.box, 10, 10).points);
                });
            });

            vpc.loadBalancers = _.filter(vpc.loadBalancers, lb => lb.paths.length > 0);
        });

        peerings.forEach(peering => {
            var requester = _.find(vpcs, { id: peering.requesterVpcInfo.id });
            var accepter  = _.find(vpcs, { id: peering.accepterVpcInfo.id  });

            if (requester && accepter) {
                requester.peerings.requests.push(peering);
                requester.peerAnchorReq.add();

                accepter.peerings.accepts.push(peering);
                accepter.peerAnchorAcc.add();
            }
        });


        var peeringsData = [];
        var peeringOffsetV = 80;
        peerings.forEach(peering => {
            var requester = _.find(vpcs, { id: peering.requesterVpcInfo.id });
            var accepter  = _.find(vpcs, { id: peering.accepterVpcInfo.id  });

            if (requester && accepter) {
                var start = requester.peerAnchorReq.get();
                var end   = accepter.peerAnchorAcc.get();

                var points = [
                    start,
                    { x: start.x,                        y: start.y -peeringOffsetV },
                    { x: end.x - layout.vpc.spacing / 2, y: start.y -peeringOffsetV },
                    { x: end.x - layout.vpc.spacing / 2, y: end.y },
                    end
                ];

                requester.peerAnchorReq.next();
                accepter.peerAnchorAcc.next();

                peeringOffsetV += 15;

                peeringsData.push({
                    peering: peering,
                    points:  points
                });
            }
        });

        schema.call(Vpcs(vpcs, clickHandler));
        schema.call(VpcPeerings(peeringsData, clickHandler));
    }
};