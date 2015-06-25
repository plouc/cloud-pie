'use strict';

var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');
var _       = require('lodash');
var utils   = require('./utils');

AWS.config.region = 'eu-west-1';

var route53        = require('./route53');
var cloudFormation = require('./cloudFormation');
var autoscaling    = require('./autoscaling');
var loadBalancer   = require('./loadBalancer');
var ec2            = require('./ec2');

var ec2CLient = new AWS.EC2();

module.exports.fetch = function () {
    var def = Promise.defer();

    Promise.props({
        instances:      ec2.instances(),
        securityGroups: ec2.securityGroups(),
        loadBalancers:  loadBalancer.loadBalancers(),
        subnets:        ec2.subnets(),
        vpcs:           ec2.vpcs(),
        vpcPeerings:    ec2.vpcPeerings(),
        volumes:        ec2.volumes(),
        igws:           ec2.internetGateways(),
        autoscalings:   autoscaling.autoscalings(),
        cfStacks:       cloudFormation.stacks()
    })
        .then(function (props) {
            ec2CLient.describeImages({
                ImageIds: props.instances.amis
            }, function (err, data) {
                if (err) {
                    def.reject(err);
                } else {
                    console.log(chalk.yellow('- fetched AMIs'));
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

                    props.instances.instances.forEach(function (instance) {
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
                        vpcs:                 props.vpcs,
                        vpcPeerings:          props.vpcPeerings,
                        loadBalancers:        props.loadBalancers,
                        cloudFormationStacks: props.cfStacks,
                        amis:                 amis,
                        vpcTags:              utils.groupResourceTags(props.vpcs),
                        subnetTags:           utils.groupResourceTags(props.subnets),
                        instanceTags:         utils.groupResourceTags(props.instances.instances),
                        volumeTags:           utils.groupResourceTags(props.volumes),
                        internetGatewayTags:  utils.groupResourceTags(props.igws)
                    });
                }
            });
        })
    ;

    return def.promise;
};
