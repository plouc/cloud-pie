var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');
var _       = require('lodash');

AWS.config.region = 'eu-west-1';

var ec2         = new AWS.EC2();
var elb         = new AWS.ELB();
var autoscaling = new AWS.AutoScaling();

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


    var autoscalingsDef = Promise.defer();
    autoscaling.describeAutoScalingGroups({}, function (err, data) {
        if (err) {
            autoscalingsDef.reject(err);
        } else {
            autoscalingsDef.resolve(data.AutoScalingGroups.map(function (autoscaling) {
                return {
                    name:                autoscaling.AutoScalingGroupName,
                    arn:                 autoscaling.AutoScalingGroupARN,
                    minSize:             autoscaling.MinSize,
                    maxSize:             autoscaling.MaxSize,
                    desiredCapacity:     autoscaling.DesiredCapacity,
                    azs:                 autoscaling.AvailabilityZones,
                    defaultCooldown:     autoscaling.DefaultCooldown,
                    TerminationPolicies: autoscaling.TerminationPolicies,
                    subnets:             autoscaling.VPCZoneIdentifier.split(','),
                    instances:           autoscaling.Instances.map(function (instance) {
                        return {
                            id:             instance.InstanceId,
                            az:             instance.AvailabilityZone,
                            state:          instance.LifecycleState,
                            healthStatus:   instance.HealthStatus,
                            launchConfName: instance.LaunchConfigurationName
                        };
                    })
                };
            }))
        }
    });


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


    var igwsDef = Promise.defer();
    ec2.describeInternetGateways({}, function (err, data) {
        if (err) {
            igwsDef.reject(err);
        } else {
            igwsDef.resolve(data.InternetGateways.map(function (igw) {
                return {
                    id:          igw.InternetGatewayId,
                    tags:        tagsToObject(igw.Tags),
                    attachments: igw.Attachments.map(function (attachment) {
                        return {
                            vpcId: attachment.VpcId,
                            state: attachment.State
                        };
                    })
                };
            }));
        }
    });


    var volumesDef = Promise.defer();
    ec2.describeVolumes({}, function (err, data) {
        if (err) {
            volumesDef.reject(err);
        } else {
            // Attachments: [Object],
            volumesDef.resolve(data.Volumes.map(function (volume) {
                return {
                    id:               volume.VolumeId,
                    size:             volume.Size,
                    snapshotId:       volume.SnapshotId,
                    availabilityZone: volume.AvailabilityZone,
                    state:            volume.State,
                    createdAt:        volume.CreateTime,
                    type:             volume.VolumeType,
                    encrypted:        volume.Encrypted,
                    tags:             tagsToObject(volume.Tags)
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
                    autoscalings:    [],
                    loadBalancers:   [],
                    internetGateway: null
                };
            }));
        }
    });


    var vpcPeeringsDef = Promise.defer();
    ec2.describeVpcPeeringConnections({}, function (err, data) {
        if (err) {
            vpcPeeringsDef.reject(err);
        } else {
            vpcPeeringsDef.resolve(data.VpcPeeringConnections.map(function (pc) {
                return {
                    id:               pc.VpcPeeringConnectionId,
                    status:           pc.Status.Message,
                    tags:             tagsToObject(pc.Tags),
                    requesterVpcInfo: {
                        cidrBlock: pc.RequesterVpcInfo.CidrBlock,
                        ownerId:   pc.RequesterVpcInfo.OwnerId,
                        id:        pc.RequesterVpcInfo.VpcId
                    },
                    accepterVpcInfo: {
                        cidrBlock: pc.AccepterVpcInfo.CidrBlock,
                        ownerId:   pc.AccepterVpcInfo.OwnerId,
                        id:        pc.AccepterVpcInfo.VpcId
                    }
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

                    var blockDeviceMappings = instance.BlockDeviceMappings.map(function (bdm) {
                        return {
                            deviceName: bdm.DeviceName,
                            ebs: {
                                id:                  bdm.Ebs.VolumeId,
                                status:              bdm.Ebs.Status,
                                attachTime:          bdm.Ebs.AttachTime,
                                deleteOnTermination: bdm.Ebs.DeleteOnTermination
                            }
                        };
                    });

                    instances.push({
                        id:                  instance.InstanceId,
                        type:                instance.InstanceType,
                        state:               instance.State.Name,
                        privateIpAddress:    instance.PrivateIpAddress,
                        publicIpAddress:     instance.PublicIpAddress || null,
                        vpcId:               instance.VpcId,
                        subnetId:            instance.SubnetId,
                        tags:                tagsToObject(instance.Tags),
                        blockDeviceMappings: blockDeviceMappings,
                        loadBalancers:       [],
                        securityGroupsIds:   _.pluck(instance.SecurityGroups, 'GroupId'),
                        ebsOptimized:        instance.EbsOptimized
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
                    scheme:                    lb.Scheme
                };
            });

            loadBalancersDef.resolve(loadBalancers);
        }
    });

    Promise.props({
        instances:      instancesDef.promise,
        securityGroups: securityGroupsDef.promise,
        loadBalancers:  loadBalancersDef.promise,
        subnets:        subnetsDef.promise,
        vpcs:           vpcsDef.promise,
        vpcPeerings:    vpcPeeringsDef.promise,
        volumes:        volumesDef.promise,
        igws:           igwsDef.promise,
        autoscalings:   autoscalingsDef.promise
    })
        .then(function (props) {
            ec2.describeImages({
                ImageIds: _.uniq(amis)
            }, function (err, data) {
                if (err) {
                    def.reject(err);
                } else {
                    props.loadBalancers.forEach(function (lb) {
                        var lbVpc = _.find(props.vpcs, { id: lb.vpcId });
                        if (lbVpc) {
                            lbVpc.loadBalancers.push(lb);
                        }
                    });

                    _.forEach(props.subnets, function (subnet) {
                        _.find(props.vpcs, { id: subnet.vpcId }).subnets.push(subnet);
                    });

                    props.autoscalings.forEach(function (autoscaling) {
                        if (autoscaling.subnets.length > 0) {
                            var subnet = _.find(props.subnets, { id: autoscaling.subnets[0] });
                            if (subnet && subnet.vpcId) {
                                var vpc = _.find(props.vpcs, { id: subnet.vpcId });
                                if (vpc) {
                                    vpc.autoscalings.push(autoscaling);
                                    vpc.autoscalings = _.uniq(vpc.autoscalings);
                                }
                            }
                        }
                    });

                    props.instances.forEach(function (instance) {
                        var instanceSubnet = _.find(props.subnets, { id: instance.subnetId });
                        if (instanceSubnet) {
                            instanceSubnet.instances.push(instance);
                        }
                        instance.blockDeviceMappings.forEach(function (bdm) {
                            bdm.ebs.ebs = _.find(props.volumes, { id: bdm.ebs.id });
                        });
                    });

                    props.igws.forEach(function (igw) {
                        igw.attachments.forEach(function (attachment) {
                            var vpc = _.find(props.vpcs, { id: attachment.vpcId });
                            if (vpc) {
                                vpc.internetGateway = igw;
                            }
                        });
                    });

                    var amis = data.Images.map(function (image) {
                        return {
                            id:          image.ImageId,
                            name:        image.Name,
                            description: image.Description
                        };
                    });

                    def.resolve({
                        vpcs:                props.vpcs,
                        vpcPeerings:         props.vpcPeerings,
                        loadBalancers:       props.loadBalancers,
                        amis:                amis,
                        vpcTags:             groupResourceTags(props.vpcs),
                        subnetTags:          groupResourceTags(props.subnets),
                        instanceTags:        groupResourceTags(props.instances),
                        volumeTags:          groupResourceTags(props.volumes),
                        internetGatewayTags: groupResourceTags(props.igws)
                    });
                }
            });
        })
    ;

    return def.promise;
};
