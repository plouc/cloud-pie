var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var _       = require('lodash');

AWS.config.region = 'eu-west-1';

var ec2 = new AWS.EC2();
var elb = new AWS.ELB();

module.exports.fetch = function () {

    var def             = Promise.defer();
    var amis            = [];
    var vpcsInstanceIds = {};

    var instancesDef = Promise.defer();
    ec2.describeInstances({}, function (err, data) {
        if (err) {
            instancesDef.reject(err);
        } else {
            var instances = {};
            data.Reservations.forEach(function (reservation) {
                reservation.Instances.forEach(function (instanceData) {
                    var instance = {
                        id:               instanceData.InstanceId,
                        state:            instanceData.State.Name,
                        type:             instanceData.InstanceType,
                        privateIpAddress: instanceData.PrivateIpAddress,
                        publicIpAddress:  instanceData.PublicIpAddress || null,
                        vpc:              instanceData.VpcId,
                        loadBalancers:    [],
                        securityGroups:   [],
                    };

                    instanceData.SecurityGroups.forEach(function (sg) {
                        instance.securityGroups.push(sg.GroupId);
                    });

                    instance.tags = {};
                    instanceData.Tags.forEach(function (tag) {
                        instance.tags[tag.Key.toLowerCase()] = tag.Value;
                    });

                    instance.name = instance.tags.name || null;

                    instances[instance.id] = instance;

                    amis.push(instanceData.ImageId);

                    if (typeof instance.vpc != 'undefined') {
                        if (!vpcsInstanceIds[instance.vpc]) {
                            vpcsInstanceIds[instance.vpc] = [];
                        }
                        vpcsInstanceIds[instance.vpc].push(instance.id);
                    }
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
            var loadBalancers = {};

            data.LoadBalancerDescriptions.forEach(function (loadBalancerData) {
                loadBalancers[loadBalancerData.LoadBalancerName] = {
                    name:      loadBalancerData.LoadBalancerName,
                    dns:       loadBalancerData.DNSName,
                    vpc:       loadBalancerData.VPCId,
                    createdAt: loadBalancerData.CreatedTime,
                    instances: _.pluck(loadBalancerData.Instances, 'InstanceId')
                };
            });

            loadBalancersDef.resolve(loadBalancers);
        }
    });

    Promise.props({
        instances:      instancesDef.promise,
        securityGroups: securityGroupsDef.promise,
        loadBalancers:  loadBalancersDef.promise
    })
        .then(function (props) {
            ec2.describeImages({
                ImageIds: _.uniq(amis)
            }, function (err, data) {
                if (err) {
                    def.reject(err);
                } else {
                    _.forOwn(props.loadBalancers, function (loadBalancer) {
                        loadBalancer.instances.forEach(function (instanceId) {
                            if (props.instances[instanceId]) {
                                props.instances[instanceId].loadBalancers.push(loadBalancer.name);
                            }
                        });
                    });


                    var allTags = {};
                    _.forOwn(props.instances, function (instance) {
                        _.forOwn(instance.tags, function (tagValue, tagKey) {
                            if (!allTags[tagKey]) {
                                allTags[tagKey] = [];
                            }
                            if (_.indexOf(allTags[tagKey], tagValue) === -1) {
                                allTags[tagKey].push(tagValue);
                            }
                        });
                    });
                    props.tags = allTags;

                    var amis = [];
                    data.Images.forEach(function (image) {
                        amis.push({
                            id:          image.ImageId,
                            name:        image.Name,
                            description: image.Description
                        });
                    });
                    props.amis = amis;

                    props.vpcs = {};
                    ec2.describeVpcs({
                        VpcIds: _.keys(vpcsInstanceIds)
                    }, function (err, data) {
                        if (err) {
                            def.reject(err);
                        } else {
                            data.Vpcs.forEach(function (vpcData) {
                                props.vpcs[vpcData.VpcId] = {
                                    id:        vpcData.VpcId,
                                    state:     vpcData.State,
                                    default:   vpcData.IsDefault,
                                    cidrBlock: vpcData.CidrBlock,
                                    instances: vpcsInstanceIds[vpcData.VpcId]
                                };
                            });
                            def.resolve(props);
                        }
                    });
                }
            });
        })
    ;

    return def.promise;
};
