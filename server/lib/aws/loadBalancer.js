var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');
var _       = require('lodash');

var elb = new AWS.ELB();

module.exports.loadBalancers = function () {
    var def = Promise.defer();

    elb.describeLoadBalancers({}, function (err, data) {
        if (err) {
            def.reject(err);
        } else {
            console.log(chalk.yellow('- fetched load balancers'));
            def.resolve(data.LoadBalancerDescriptions.map(function (lb) {
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
            }));
        }
    });

    return def.promise;
};
