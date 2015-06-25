'use strict';

var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');

var autoscaling = new AWS.AutoScaling();

module.exports.autoscalings = function () {
    var def = Promise.defer();

    autoscaling.describeAutoScalingGroups({}, function (err, data) {
        if (err) {
            def.reject(err);
        } else {
            console.log(chalk.yellow('- fetched autoscaling groups'));
            def.resolve(data.AutoScalingGroups.map(function (autoscaling) {
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

    return def.promise;
};
