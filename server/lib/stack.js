var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var _       = require('lodash');

AWS.config.region = 'eu-west-1';

var ec2 = new AWS.EC2();
var elb = new AWS.ELB();

module.exports.fetch = function () {
    var def  = Promise.defer();

    function tagsToObject(tagsArray) {
        var tags = {};
        tagsArray.forEach(function (tag) {
            tags[tag.Key.toLowerCase()] = tag.Value;
        });

        return tags;
    }

    function groupResourceTags(resources) {
        var grouped = [];

        resources.forEach(function (resource) {
            _.forOwn(resource.tags, function (tagValue, tagKey) {
                if (!_.find(grouped, { key: tagKey })) {
                    grouped.push({ key: tagKey, values: [] });
                }
                _.find(grouped, { key: tagKey }).values.push(tagValue);
            });
        });

        grouped.forEach(function (tag) {
            tag.values = _.uniq(tag.values);
        });

        return grouped;
    }

    var subnetsDef = Promise.defer();
    ec2.describeSubnets({}, function (err, data) {
        if (err) {
            subnetsDef.reject(err);
        } else {
            subnetsDef.resolve(data.Subnets.map(function (subnet) {
                return {
                    id:                  subnet.SubnetId,
                    state:               subnet.State,
                    vpcId:               subnet.VpcId,
                    cidrBlock:           subnet.CidrBlock,
                    zone:                subnet.AvailabilityZone,
                    azDefault:           subnet.DefaultForAz,
                    mapPublicIpOnLaunch: subnet.MapPublicIpOnLaunch,
                    tags:                tagsToObject(subnet.Tags),
                    instances:           [],
                    loadBalancers:       []
                };
            }));
        }
    });


    var vpcsDef = Promise.defer();
    ec2.describeVpcs({}, function (err, data) {
        if (err) {
            vpcsDef.reject(err);
        } else {
            vpcsDef.resolve(data.Vpcs.map(function (vpc) {
                return {
                    id:              vpc.VpcId,
                    state:           vpc.State,
                    cidrBlock:       vpc.CidrBlock,
                    dhcpOptionsId:   vpc.DhcpOptionsId,
                    instanceTenancy: vpc.InstanceTenancy,
                    tags:            tagsToObject(vpc.Tags),
                    isDefault:       vpc.IsDefault,
                    subnets:         [],
                    loadBalancers:   []
                };
            }));
        }
    });


    var instancesDef = Promise.defer();
    var amis         = [];
    ec2.describeInstances({}, function (err, data) {
        if (err) {
            instancesDef.reject(err);
        } else {
            var instances = [];
            data.Reservations.forEach(function (reservation) {
                reservation.Instances.forEach(function (instance) {
                    amis.push(instance.ImageId);

                    instances.push({
                        id:                instance.InstanceId,
                        state:             instance.State.Name,
                        type:              instance.InstanceType,
                        privateIpAddress:  instance.PrivateIpAddress,
                        publicIpAddress:   instance.PublicIpAddress || null,
                        vpcId:             instance.VpcId,
                        subnetId:          instance.SubnetId,
                        tags:              tagsToObject(instance.Tags),
                        loadBalancers:     [],
                        securityGroupsIds: _.pluck(instance.SecurityGroups, 'GroupId')
                    });
                });
            });

            instancesDef.resolve(instances);
        }
    });

    var securityGroupsDef = Promise.defer();
    ec2.describeSecurityGroups({}, function (err, data) {
        if (err) {
            securityGroupsDef.reject(err);
        } else {
            var securityGroups = [];

            data.SecurityGroups.forEach(function (securityGroup) {
                securityGroups.push(securityGroup);
            });

            securityGroupsDef.resolve(securityGroups);
        }
    });

    var loadBalancersDef = Promise.defer();
    elb.describeLoadBalancers({}, function (err, data) {
        if (err) {
            loadBalancersDef.reject(err);
        } else {
            var loadBalancers = data.LoadBalancerDescriptions.map(function (lb) {
                return {
                    name:                      lb.LoadBalancerName,
                    dnsName:                   lb.DNSName,
                    canonicalHostedZoneName:   lb.CanonicalHostedZoneName,
                    canonicalHostedZoneNameID: lb.CanonicalHostedZoneNameID,
                    vpcId:                     lb.VPCId,
                    createdAt:                 lb.CreatedTime,
                    instancesIds:              _.pluck(lb.Instances, 'InstanceId'),
                    instances:                 [], // populated later after instance info fetching
                    scheme:                    lb.Scheme
                };
                /*
                ListenerDescriptions: [Object],
                Policies: [Object],
                BackendServerDescriptions: [],
                AvailabilityZones: [Object],
                Subnets: [Object],
                HealthCheck: [Object],
                SourceSecurityGroup: [Object],
                SecurityGroups: [Object],
                Scheme: 'internet-facing' },
                */
            });

            loadBalancersDef.resolve(loadBalancers);
        }
    });

    Promise.props({
        instances:      instancesDef.promise,
        securityGroups: securityGroupsDef.promise,
        loadBalancers:  loadBalancersDef.promise,
        subnets:        subnetsDef.promise,
        vpcs:           vpcsDef.promise
    })
        .then(function (props) {
            ec2.describeImages({
                ImageIds: _.uniq(amis)
            }, function (err, data) {
                if (err) {
                    def.reject(err);
                } else {
                    props.loadBalancers.forEach(function (lb) {
                        lb.instances = lb.instancesIds.map(function (instanceId) {
                            return _.find(props.instances, { id: instanceId });
                        });
                        _.find(props.vpcs, { id: lb.vpcId }).loadBalancers.push(lb);
                    });

                    props.instances.forEach(function (instance) {
                        _.find(props.subnets, { id: instance.subnetId }).instances.push(instance);
                    });

                    _.forEach(props.subnets, function (subnet) {
                        _.find(props.vpcs, { id: subnet.vpcId }).subnets.push(subnet);
                    });

                    var amis = data.Images.map(function (image) {
                        return {
                            id:          image.ImageId,
                            name:        image.Name,
                            description: image.Description
                        };
                    });

                    def.resolve({
                        vpcs:          props.vpcs,
                        subnets:       props.subnets,
                        instances:     props.instances,
                        loadBalancers: props.loadBalancers,
                        amis:          amis,
                        vpcTags:       groupResourceTags(props.vpcs),
                        subnetTags:    groupResourceTags(props.subnets),
                        instanceTags:  groupResourceTags(props.instances)
                    });
                }
            });
        })
    ;

    return def.promise;
};
