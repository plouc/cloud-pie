var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');

var route53 = new AWS.Route53();

module.exports.hostedZones = function () {
    var def = Promise.defer();

    route53.listHostedZones({}, function (err, data) {
        if (err) {
            def.reject(err);
        } else {
            console.log(chalk.yellow('- fetched hosted zones'));
            data.HostedZones.forEach(function (zone) {
                route53.listResourceRecordSets({ HostedZoneId: zone.Id }, function (err, data) {
                    data.ResourceRecordSets.forEach(function (r) {
                        console.log(r);
                    });
                });
            });
            def.resolve(data);
        }
    });

    return def.promise;
};
