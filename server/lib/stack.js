var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var _       = require('lodash');

AWS.config.region = 'eu-west-1';

var ec2 = new AWS.EC2();

module.exports.fetch = function () {

    var def   = Promise.defer();
    var amis  = [];

    var instancesDef = Promise.defer();
    ec2.describeInstances({}, function (err, data) {
        if (err) {
            instancesDef.reject(err);
        } else {
            var instances = [];
            data.Reservations.forEach(function (reservation) {
                reservation.Instances.forEach(function (instanceData) {
                    var instance = {
                        id:               instanceData.InstanceId,
                        state:            instanceData.State.Name,
                        type:             instanceData.InstanceType,
                        privateIpAddress: instanceData.PrivateIpAddress,
                        publicIpAddress:  instanceData.PublicIpAddress || null
                    };

                    instance.tags = {};
                    instanceData.Tags.forEach(function (tag) {
                        instance.tags[tag.Key.toLowerCase()] = tag.Value;
                    });

                    instance.name = instance.tags.name || null;

                    instances.push(instance);

                    amis.push(instanceData.ImageId);
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
            /*
            Description: "Search LB dev"
            GroupId: "sg-b0dc0ed5"
            GroupName: "SG-CPL-ADM-SEARCH-DEV-LB"
            IpPermissions: Array[3]
            IpPermissionsEgress: Array[1]
            OwnerId: "167012524447"
            Tags: Array[1]
            VpcId: "vpc-ef53ba8a"
            */

            securityGroupsDef.resolve(securityGroups);
        }
    });

    Promise.props({
        instances:      instancesDef.promise,
        securityGroups: securityGroupsDef.promise
    })
        .then(function (props) {
            ec2.describeImages({
                ImageIds: amis
            }, function (err, data) {
                if (err) {
                    def.reject(err);
                } else {
                    var amis = [];

                    data.Images.forEach(function (image) {
                        amis.push({
                            id:          image.ImageId,
                            name:        image.Name,
                            description: image.Description
                        });
                    });

                    props.amis = amis;

                    def.resolve(props);
                }
            });
        })
    ;

    return def.promise;
};
