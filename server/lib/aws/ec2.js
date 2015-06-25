'use strict';

var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');
var utils   = require('./utils');
var _       = require('lodash');

var ec2 = new AWS.EC2();

module.exports = {
    vpcs: function () {
        var def = Promise.defer();

        ec2.describeVpcs({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched VPCs'));
                def.resolve(data.Vpcs.map(function (vpc) {
                    return {
                        id:              vpc.VpcId,
                        state:           vpc.State,
                        cidrBlock:       vpc.CidrBlock,
                        dhcpOptionsId:   vpc.DhcpOptionsId,
                        instanceTenancy: vpc.InstanceTenancy,
                        tags:            utils.tagsToObject(vpc.Tags),
                        isDefault:       vpc.IsDefault,
                        subnets:         [],
                        autoscalings:    [],
                        loadBalancers:   [],
                        internetGateway: null
                    };
                }));
            }
        });

        return def.promise;
    },

    vpcPeerings: function () {
        var def = Promise.defer();

        ec2.describeVpcPeeringConnections({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched vpc peerings'));
                def.resolve(data.VpcPeeringConnections.map(function (pc) {
                    return {
                        id:               pc.VpcPeeringConnectionId,
                        status:           pc.Status.Message,
                        tags:             utils.tagsToObject(pc.Tags),
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

        return def.promise
    },

    internetGateways: function () {
        var def = Promise.defer();

        ec2.describeInternetGateways({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched internet gateways'));
                def.resolve(data.InternetGateways.map(function (igw) {
                    return {
                        id:          igw.InternetGatewayId,
                        tags:        utils.tagsToObject(igw.Tags),
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

        return def.promise;
    },

    subnets: function () {
        var def = Promise.defer();

        ec2.describeSubnets({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched subnets'));
                def.resolve(data.Subnets.map(function (subnet) {
                    return {
                        id:                  subnet.SubnetId,
                        state:               subnet.State,
                        vpcId:               subnet.VpcId,
                        cidrBlock:           subnet.CidrBlock,
                        zone:                subnet.AvailabilityZone,
                        azDefault:           subnet.DefaultForAz,
                        mapPublicIpOnLaunch: subnet.MapPublicIpOnLaunch,
                        tags:                utils.tagsToObject(subnet.Tags),
                        instances:           [],
                        loadBalancers:       []
                    };
                }));
            }
        });

        return def.promise;
    },

    instances: function () {
        var def  = Promise.defer();
        var amis = [];

        ec2.describeInstances({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched instances'));
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
                            tags:                utils.tagsToObject(instance.Tags),
                            blockDeviceMappings: blockDeviceMappings,
                            loadBalancers:       [],
                            securityGroupsIds:   _.pluck(instance.SecurityGroups, 'GroupId'),
                            ebsOptimized:        instance.EbsOptimized
                        });
                    });
                });

                def.resolve({
                    instances: instances,
                    amis:      _.uniq(amis)
                });
            }
        });

        return def.promise;
    },

    volumes: function () {
        var def = Promise.defer();

        ec2.describeVolumes({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched volumes'));
                // Attachments: [Object],
                def.resolve(data.Volumes.map(function (volume) {
                    return {
                        id:               volume.VolumeId,
                        size:             volume.Size,
                        snapshotId:       volume.SnapshotId,
                        availabilityZone: volume.AvailabilityZone,
                        state:            volume.State,
                        createdAt:        volume.CreateTime,
                        type:             volume.VolumeType,
                        encrypted:        volume.Encrypted,
                        tags:             utils.tagsToObject(volume.Tags)
                    };
                }));
            }
        });

        return def.promise;
    },

    securityGroups: function () {
        var def = Promise.defer();

        ec2.describeSecurityGroups({}, function (err, data) {
            if (err) {
                def.reject(err);
            } else {
                console.log(chalk.yellow('- fetched security groups'));
                def.resolve(data.SecurityGroups.map(function (securityGroup) {
                    return securityGroup;
                }));
            }
        });

        return def.promise;
    }
};